import { Button } from '@app/components/common/buttons/Button/Button'
import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'

export default function excelExport({ excelData, fileName }) {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData)
    const colums = Object.keys(excelData[0])
    const columsModificado = colums.map((item) =>
      item === 'product' ? 'date' : item
    )
    const max_width = excelData.reduce(
      (w, r) => Math.max(w, r.product.length),
      10
    )
    // const tt = excelData.map(w => {console.log(Object.keys(w))})

    ws['!cols'] = [{ wch: max_width }]
    XLSX.utils.sheet_add_aoa(ws, [columsModificado], {
      origin: 'A1'
    })
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }
  return (
    <>
      <Button
        type="primary"
        severity="warning"
        onClick={(e) => exportToExcel(fileName)}>
        Export
      </Button>
    </>
  )
}
