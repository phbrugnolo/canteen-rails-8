const isValid = (cpf, isStrict) => {
  const REJECT_LIST = Object.freeze(['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999'])
  const STRICT_STRIP_REGEX = /[.-]/g;
  const LOOSE_STRIP_REGEX = /[^\d]/g;

  const strip = (cpfToStrip, isStrict) => ((cpfToStrip || '').toString().replace(isStrict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX, ''))
  const stripped = strip(cpf, isStrict)

  if(!stripped) { return false }
  if(stripped.length !== 11) { return false }
  if(REJECT_LIST.includes(stripped)) { return false }

  let numbers = stripped.substr(0, 9)

  const verifierDigit = n => {
    const numberList = n.split('').map(number => parseInt(number, 10))
    const modulus = numberList.length + 1
    const multiplied = numberList.map((number, index) => number * (modulus - index))
    const mod = multiplied.reduce((buffer, number) => buffer + number) % 11;
    return mod < 2 ? 0 : 11 - mod
  }

  numbers += verifierDigit(numbers)
  numbers += verifierDigit(numbers)

  return numbers.substr(-2) === stripped.substr(-2)
}

export const isValidCpf = cpf => isValid(cpf, true)
