import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logo from 'src/assets/images/JetCargo.png'
import { getInvoiceNumber } from '../../../services/invoiceService'

const PDFGenerator = async (
  charges,
  customerName,
  rtnNumber,
  subtotal,
  totalISV,
  grandTotal,
  packages,
  pricePerPound,
  dollarExchangeRate,
  jetCargoData,
  customerPhone,
  customerAddress,
) => {
  try {
    const { LAST_NUMBER } = await getInvoiceNumber()

    const doc = new jsPDF()

    const getHighestWeight = (volumetricWeight, realWeight) => {
      const volWeight = parseFloat(volumetricWeight) || 0
      const realWeightValue = parseFloat(realWeight) || 0
      return Math.max(volWeight, realWeightValue)
    }

    const formatCurrency = (amount) => {
      return `L${parseFloat(amount).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, '')}`
    }

    const calculatePriceInLempiras = (priceInDollars, exchangeRate) => {
      const priceAfterDiscount = priceInDollars * 0.85
      return priceAfterDiscount * exchangeRate
    }

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }

    const numberToWords = (num) => {
      const unidades = [
        'cero',
        'uno',
        'dos',
        'tres',
        'cuatro',
        'cinco',
        'seis',
        'siete',
        'ocho',
        'nueve',
      ]
      const decenas = [
        'diez',
        'once',
        'doce',
        'trece',
        'catorce',
        'quince',
        'dieciséis',
        'diecisiete',
        'dieciocho',
        'diecinueve',
      ]
      const decenas2 = [
        'veinte',
        'treinta',
        'cuarenta',
        'cincuenta',
        'sesenta',
        'setenta',
        'ochenta',
        'noventa',
      ]
      const centenas = [
        'cien',
        'doscientos',
        'trescientos',
        'cuatrocientos',
        'quinientos',
        'seiscientos',
        'setecientos',
        'ochocientos',
        'novecientos',
      ]

      const convert = (n) => {
        if (n < 10) return unidades[n]
        if (n < 20) return decenas[n - 10]
        if (n < 100)
          return decenas2[Math.floor(n / 10) - 2] + (n % 10 !== 0 ? ' y ' + unidades[n % 10] : '')
        if (n < 1000)
          return centenas[Math.floor(n / 100) - 1] + (n % 100 !== 0 ? ' ' + convert(n % 100) : '')
        if (n < 1000000) {
          const thousands = Math.floor(n / 1000)
          const remainder = n % 1000
          return (
            (thousands > 1 ? convert(thousands) + ' mil' : 'mil') +
            (remainder !== 0 ? ' ' + convert(remainder) : '')
          )
        }
        if (n < 1000000000) {
          const millions = Math.floor(n / 1000000)
          const remainder = n % 1000000
          return (
            (millions > 1 ? convert(millions) + ' millones' : 'un millón') +
            (remainder !== 0 ? ' ' + convert(remainder) : '')
          )
        }
        return n.toString()
      }

      const [integerPart, decimalPart] = num.toFixed(2).split('.')
      const integerPartInWords = convert(parseInt(integerPart))
      const decimalPartInWords = convert(parseInt(decimalPart))

      return `${integerPartInWords} lempiras con ${decimalPartInWords} centavos`
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = logo
      img.onload = () => {
        doc.addImage(img, 'PNG', 10, 20, 45, 20)

        doc.setFontSize(15)
        doc.text(`${jetCargoData.NOMBRE}`, 70, 20)
        doc.setFontSize(9)
        doc.text(`RTN: ${jetCargoData.RTN}`, 70, 26)
        doc.text(`E-mail: ${jetCargoData.EMAIL}`, 70, 32)
        doc.text(`Cel: ${jetCargoData.TELEFONO}`, 70, 38)
        doc.text(`Dirección: ${jetCargoData.DIRECCION}`, 70, 44)

        doc.setFontSize(12)
        doc.text('Factura', 175, 20, { align: 'center' })
        doc.setFontSize(9)
        doc.text(`Número: ${LAST_NUMBER + 1}`, 160, 26)
        doc.text(`Fecha: ${formatDate(new Date())}`, 160, 32)

        doc.roundedRect(150, 10, 50, 30, 5, 5)

        doc.setLineWidth(0.5)
        doc.line(10, 50, 200, 50)

        doc.roundedRect(10, 55, 190, 30, 5, 5)
        doc.setFontSize(12)
        doc.text('Detalles del cliente', 14, 64)
        doc.setFontSize(10)
        doc.text(`Cliente: ${customerName}`, 14, 70)
        doc.text(`RTN: ${rtnNumber}`, 14, 76)
        doc.text(`Teléfono: ${customerPhone}`, 120, 70)
        doc.text(`Dirección: ${customerAddress}`, 120, 76)

        autoTable(doc, {
          head: [['Cant.', 'Tracking', 'Peso', 'Precio', 'Total']],
          body: charges.map((charge, index) => {
            const priceInDollars = parseFloat(pricePerPound.replace('$ ', ''))
            const exchangeRate = parseFloat(dollarExchangeRate.replace('L ', ''))
            const priceInLempiras = calculatePriceInLempiras(priceInDollars, exchangeRate)

            return [
              1,
              `${packages[index].tracking}`,
              `${getHighestWeight(charge.PESO_VOLUMEN, charge.PESO_REAL)} Libras`,
              formatCurrency(priceInLempiras),
              `L${charge.SUBTOTAL}`,
            ]
          }),
          startY: 90,
          headStyles: {
            0: { halign: 'left' },
            1: { halign: 'left' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
          },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { halign: 'left' },
            2: { cellWidth: 27, halign: 'right' },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 35, halign: 'right' },
          },
        })

        const rightMargin = doc.internal.pageSize.getWidth() - 16
        const textWidth = doc.getTextWidth('ISV (15%):')

        const offset = 10

        let finalY = doc.lastAutoTable.finalY + 10

        doc.text(`Subtotal:`, rightMargin - textWidth - offset, finalY, { align: 'right' })
        doc.text(`${subtotal}`, rightMargin, finalY, { align: 'right' })

        doc.text(`ISV (15%):`, rightMargin - textWidth - offset, finalY + 6, { align: 'right' })
        doc.text(`${totalISV}`, rightMargin, finalY + 6, { align: 'right' })

        doc.text(`Total:`, rightMargin - textWidth - offset, finalY + 12, { align: 'right' })
        doc.text(`${grandTotal}`, rightMargin, finalY + 12, { align: 'right' })

        const grandTotalInWords = numberToWords(
          parseFloat(grandTotal.replace('L', '').replace(',', '')),
        )
        doc.text(`Valor en letras: ${grandTotalInWords}`, 10, finalY + 30)

        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.text(`Página ${i} de ${pageCount}`, 200, 290, { align: 'right' })
        }

        const pdfBlob = doc.output('blob')
        resolve(pdfBlob)
      }
      img.onerror = (error) => {
        reject(new Error('No se pudo cargar la imagen'))
      }
    })
  } catch (error) {
    throw new Error(`Error al generar el PDF`)
  }
}

export default PDFGenerator
