# WickedPDF Global Configuration
#
# Use this to set up shared configuration options for your entire application.
# Any of the configuration options shown here can also be applied to single
# models by passing arguments to the `render :pdf` call.
#
# To learn more, check out the README:
#
# https://github.com/mileszs/wicked_pdf/blob/master/README.md

WickedPdf.configure do |config|
  config.exe_path = Gem.bin_path("wkhtmltopdf-binary", "wkhtmltopdf")
  config.enable_local_file_access = true

  # Layout file to be used for all PDFs
  # (but can be overridden in `render :pdf` calls)
  # config.layout = 'pdf.html'

  # Using wkhtmltopdf without an X server can be achieved by enabling the
  # 'use_xvfb' flag. This will wrap all wkhtmltopdf commands around the
  # 'xvfb-run' command, in order to simulate an X server.
  #
  # config.use_xvfb = true
end
