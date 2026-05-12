import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';

export class ExportService {
  /**
   * Exporta dados para Excel (XLSX)
   */
  static async exportToExcel(data: any[], filename: string) {
    try {
      // Cria a aba do excel
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Relatório");

      // Escreve para base64
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      // Salva no sistema de arquivos temporário do Expo
      const uri = FileSystem.documentDirectory + `${filename}.xlsx`;
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Abre a janela nativa de compartilhamento
      await Sharing.shareAsync(uri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Exportar Relatório Excel',
        UTI: 'com.microsoft.excel.xls'
      });
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      throw error;
    }
  }

  /**
   * Exporta dados para PDF gerando um HTML dinâmico
   */
  static async exportToPDF(htmlContent: string, filename: string) {
    try {
      // Gera o PDF a partir do HTML
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });

      // Move para um arquivo com nome bonito (o expo-print gera nome aleatório)
      const newUri = FileSystem.documentDirectory + `${filename}.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri
      });

      // Abre a janela nativa de compartilhamento
      await Sharing.shareAsync(newUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Exportar Relatório PDF',
        UTI: 'com.adobe.pdf'
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      throw error;
    }
  }

  /**
   * Helper para montar HTML básico de tabela
   */
  static generateHTMLTable(title: string, headers: string[], rows: any[][]) {
    const tableHeaders = headers.map(h => `<th>${h}</th>`).join('');
    
    const tableRows = rows.map(row => {
      const cols = row.map(col => `<td>${col}</td>`).join('');
      return `<tr>${cols}</tr>`;
    }).join('');

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
            h1 { color: #0ea5e9; text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f8fafc; color: #475569; padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e1; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .high-absence { color: #ef4444; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>GeoClass - ${title}</h1>
          <table>
            <thead><tr>${tableHeaders}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <p style="margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center;">
            Relatório gerado automaticamente pelo sistema GeoClass em ${new Date().toLocaleDateString('pt-BR')}
          </p>
        </body>
      </html>
    `;
  }
}
