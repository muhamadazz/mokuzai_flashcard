import { useCallback } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { loadExcelFromFile, loadExcelFromUrl } from "../utils/excelLoader";
import type { VocabularyWord } from "../data/vocabulary";

interface FileUploadProps {
  onDataLoaded: (data: VocabularyWord[]) => void;
  currentData: VocabularyWord[];
}

export function FileUpload({ onDataLoaded, currentData }: FileUploadProps) {
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const data = await loadExcelFromFile(file);
          if (data.length > 0) {
            onDataLoaded(data);
          } else {
            alert("Tidak ada data yang bisa dibaca dari file Excel");
          }
        } catch {
          alert("Gagal membaca file Excel");
        }
      }
    },
    [onDataLoaded]
  );

  const handleLoadFromPublic = useCallback(async () => {
    const data = await loadExcelFromUrl("/kotoba_mokuzai.xlsx");
    if (data.length > 0) {
      onDataLoaded(data);
    } else {
      alert("File /kotoba_mokuzai.xlsx tidak ditemukan. Silakan upload file Excel Anda.");
    }
  }, [onDataLoaded]);

  return (
    <div className="space-y-4">
      <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          </div>

          {currentData.length > 0 ? (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {currentData.length} kosakata loaded
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Upload file baru untuk mengganti data
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Upload file Excel Anda atau gunakan data contoh
            </p>
          )}

          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload Excel</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleLoadFromPublic}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Atau coba load dari /public/kotoba_mokuzai.xlsx
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Format Excel: Kolom Halaman, Kanji, Hiragana, Arti
      </div>
    </div>
  );
}
