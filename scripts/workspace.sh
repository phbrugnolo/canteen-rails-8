echo 'cd ~' >> ~/.bashrc
source ~/.bashrc

# Update and install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install curl gpg gcc g++ make zip plocate jq -y

# docker installation
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
sudo apt-get update
sudo apt-get install -y ca-certificates
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER

## Restart VM

sudo systemctl enable docker.service
sudo systemctl enable containerd.service

# This folder is necessary to connect with pgAdmin automatically
mkdir -p ~/pgadmin_servers

sudo tee ~/pgadmin_servers/servers.json << 'EOF'
{
  "Servers": {
    "1": {
      "Name": "PostgreSQL Dev",
      "Group": "Servers",
      "Host": "postgresql",
      "Port": 5432,
      "MaintenanceDB": "canteen_development",
      "Username": "postgres",
      "SSLMode": "prefer"
    }
  }
}
EOF

# Postgres and PgAdmin containers
sudo tee ~/start_containers.sh << 'EOF'
#!/bin/bash

docker network create postgresql_development >/dev/null 2>&1 || true

if [ ! "$(docker ps -q -f name=postgresql)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=postgresql)" ]; then
    docker container start postgresql
  else
    docker container run --name postgresql --restart always -d \
      --network postgresql_development \
      -p 5432:5432 \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_DB=canteen_development \
      -v pgdata:/var/lib/postgresql/data \
      postgres:17-alpine
  fi
fi

until docker exec postgresql pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done

if [ ! "$(docker ps -q -f name=pgAdmin)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=pgAdmin)" ]; then
    docker container start pgAdmin
  else
    docker container run --name pgAdmin --restart always -d \
      --network postgresql_development \
      -p 8080:80 \
      -e PGADMIN_CONFIG_SERVER_MODE=False \
      -e PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED=False \
      -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
      -e PGADMIN_DEFAULT_PASSWORD=admin \
      -v pgadmin_data:/var/lib/pgadmin \
      -v $HOME/pgadmin_servers/servers.json:/pgadmin4/servers.json \
      dpage/pgadmin4
  fi
fi
EOF

sudo chown $USER:$USER $HOME/start_containers.sh && sudo chmod +x ~/start_containers.sh
echo 'bash ~/start_containers.sh' >> ~/.bashrc

# Restart VM

# RVM e ruby
curl -sSL https://rvm.io/mpapis.asc | gpg --import -
curl -sSL https://rvm.io/pkuczynski.asc | gpg --import -
\curl -sSL https://get.rvm.io | bash -s stable
source ~/.rvm/scripts/rvm
sudo apt update
rvm install 3.4.5
rvm docs generate-ri
rvm --default use 3.4.5
rvm gemset create canteen
rvm gemset use canteen
gem install bundler
bundle config --global timeout 10000
bundle config --global retry 10000
gem install rails

sudo tee /etc/profile.d/rvm.sh << 'EOF'
#
# RVM profile
#
# /etc/profile.d/rvm.sh # sh extension required for loading.
#

if
  [ -n "${BASH_VERSION:-}" -o -n "${ZSH_VERSION:-}" ] &&
  test "`\command \ps -p $$ -o ucomm=`" != dash &&
  test "`\command \ps -p $$ -o ucomm=`" != sh
then
  [[ -n "${rvm_stored_umask:-}" ]] || export rvm_stored_umask=$(umask)

  # Load user rvmrc configurations, if exist
  for file in "/etc/rvmrc" "$HOME/.rvmrc"
  do
    [[ -s "$file" ]] && source $file
  done
  if
    [[ -n "${rvm_prefix:-}" ]] &&
    [[ -s "${rvm_prefix}/.rvmrc" ]] &&
    [[ ! "$HOME/.rvmrc" -ef "${rvm_prefix}/.rvmrc" ]]
  then
    source "${rvm_prefix}/.rvmrc"
  fi

  # Load RVM if it is installed, try user then root install
  if
    [[ -s "$rvm_path/scripts/rvm" ]]
  then
    source "$rvm_path/scripts/rvm"
  elif
    [[ -s "$HOME/.rvm/scripts/rvm" ]]
  then
    true ${rvm_path:="$HOME/.rvm"}
    source "$HOME/.rvm/scripts/rvm"
  elif
    [[ -s "/usr/local/rvm/scripts/rvm" ]]
  then
    true ${rvm_path:="/usr/local/rvm"}
    source "/usr/local/rvm/scripts/rvm"
  fi

  # Add $rvm_bin_path to $PATH if necessary. Make sure this is the last PATH variable change
  if [[ -n "${rvm_bin_path}" && ! ":${PATH}:" == *":${rvm_bin_path}:"* ]]
  then PATH="${PATH}:${rvm_bin_path}"
  fi
fi
EOF

sudo chmod +x /etc/profile.d/rvm.sh && source /etc/profile.d/rvm.sh

# Node.js
NVM_LATEST_VERSION=$(curl -s https://api.github.com/repos/nvm-sh/nvm/releases/latest | jq -r .tag_name)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_LATEST_VERSION}/install.sh | bash
source ~/.bashrc
source ~/.bash_profile
nvm install --lts
nvm alias default node
nvm install-latest-npm
npm install -g yarn

# Development Profile
sudo tee /etc/profile.d/canteen.sh << 'EOF'
#!/bin/bash

export LANG=C.UTF-8
export TZ=America/Sao_Paulo
export EDITOR=nano
export RAILS_ENV=development
export NODE_ENV=development
EOF

sudo chmod +x /etc/profile.d/canteen.sh && source /etc/profile.d/canteen.sh

# Git Credential Manager
GCM_LATEST_VERSION=$(curl -s https://api.github.com/repos/git-ecosystem/git-credential-manager/releases/latest | jq -r .tag_name | sed 's/^v//')
wget https://github.com/GitCredentialManager/git-credential-manager/releases/download/v${GCM_LATEST_VERSION}/gcm-linux_amd64.${GCM_LATEST_VERSION}.deb
sudo dpkg -i gcm-linux_amd64.${GCM_LATEST_VERSION}.deb
git-credential-manager configure
git config --global credential.credentialStore cache
git config --global pull.rebase false
rm gcm-linux_amd64.${GCM_LATEST_VERSION}.deb
