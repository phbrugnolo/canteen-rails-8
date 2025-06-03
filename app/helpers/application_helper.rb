module ApplicationHelper
  def number_to_words(value)
    integer_part = value.to_i
    fractional_part = ((value - integer_part) * 100).round

    # Correção para casos de arredondamento
    if fractional_part >= 100
      integer_part += 1
      fractional_part = 0
    end

    integer_words = integer_part.to_words(locale: :'pt-BR').upcase
    fractional_words = fractional_part.to_words(locale: :'pt-BR').upcase

    integer_unit = integer_part == 1 ? 'REAL' : 'REAIS'
    fractional_unit = fractional_part == 1 ? 'CENTAVO' : 'CENTAVOS'

    if integer_part == 0 && fractional_part > 0
      "#{fractional_words} #{fractional_unit}"
    elsif fractional_part == 0
      "#{integer_words} #{integer_unit}"
    else
      "#{integer_words} #{integer_unit} E #{fractional_words} #{fractional_unit}"
    end
  end
end
