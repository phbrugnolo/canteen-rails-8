ARG RUBY_VERSION=3.4.5
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# Install system build/runtime dependencies (removido 'watchman' – não está nos repositórios Debian slim)
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qq && \
        apt-get install --no-install-recommends -y \
            curl \
            gnupg \
            git \
            build-essential \
            libpq-dev \
            libssl-dev \
            libyaml-dev \
            zlib1g-dev \
            libreadline-dev \
            node-gyp \
            pkg-config \
            python-is-python3 && \
        rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# Set development environment
ENV RAILS_ENV="development" \
    NODE_ENV="development"


# Install JavaScript dependencies
ARG NODE_VERSION=22.19.0
ARG YARN_VERSION=4.9.4
ENV PATH=/usr/local/node/bin:$PATH
RUN curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
    /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
    npm install -g corepack && \
    corepack enable && \
    corepack prepare yarn@"${YARN_VERSION}" --activate && \
    rm -rf /tmp/node-build-master

# Rails app lives here
WORKDIR /usr/src/app

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Install node modules
COPY package.json yarn.lock ./
RUN yarn install

# Copy application code
COPY . .

EXPOSE 3000
CMD ["bin/dev"]
