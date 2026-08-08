import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Card, ScoreCircle, Badge, ProgressBar, Spinner } from '../components/ui/index'
import Button from '../components/ui/Button'
import { uploadCV, analyzeCV } from '../services/api'

export default function CVAnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0]) {
      setFile(acceptedFiles[0])
      setAnalysisResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const handleUploadAndAnalyze = async () => {
    if (!file) return

    try {
      setUploading(true)
      const uploaded = await uploadCV(file)
      toast.success('Tải CV thành công! Đang tiến hành phân tích AI...')

      setUploading(false)
      setAnalyzing(true)
      const res = await analyzeCV(uploaded.id)
      setAnalysisResult(res)
      toast.success('Phân tích CV hoàn tất!')
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra')
    } finally {
      setUploading(false)
      setAnalyzing(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 className="text-display" style={{ fontSize: 36, marginBottom: 8 }}>
          Phân tích CV
        </h1>
        <p className="text-body" style={{ color: 'var(--color-ash)' }}>
          Đánh giá mức độ chuẩn hóa ATS, cấu trúc và nội dung chi tiết của hồ sơ.
        </p>
      </div>

      {/* Upload Area */}
      <Card style={{ marginBottom: 32 }}>
        <div
          {...getRootProps()}
          className={`upload-zone ${isDragActive ? 'drag-over' : ''}`}
          style={{ borderStyle: file ? 'solid' : 'dashed', borderColor: file ? 'var(--color-signal-blue)' : undefined }}
        >
          <input {...getInputProps()} />
          <p className="font-serif" style={{ fontSize: 24, color: 'var(--color-graphite)', marginBottom: 8 }}>
            {file ? file.name : 'Tải lên tập tin CV của bạn'}
          </p>
          {file ? (
            <p className="text-caption" style={{ color: 'var(--color-ash)' }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB • Nhấp hoặc kéo thả tập tin khác để thay thế
            </p>
          ) : (
            <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 14 }}>
              Kéo & thả file tại đây, hoặc <span style={{ color: 'var(--color-signal-blue)' }}>chọn từ máy tính</span> (Định dạng PDF, DOCX tối đa 10MB)
            </p>
          )}
        </div>

        {file && !analysisResult && (
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              size="lg"
              loading={uploading || analyzing}
              onClick={handleUploadAndAnalyze}
            >
              {uploading ? 'Đang tải lên...' : analyzing ? 'Đang phân tích...' : 'Bắt đầu phân tích CV'}
            </Button>
          </div>
        )}
      </Card>

      {/* Loading */}
      {analyzing && (
        <Card linen style={{ padding: 40, textAlign: 'center', marginBottom: 32 }}>
          <Spinner size={32} color="var(--color-twilight)" />
          <h3 className="font-serif" style={{ marginTop: 16, fontSize: 22, color: 'var(--color-graphite)' }}>
            Gemini AI đang rà soát hồ sơ của bạn...
          </h3>
          <p className="text-caption" style={{ color: 'var(--color-ash)', marginTop: 4 }}>
            Quá trình phân tích từ khóa ATS và đánh giá từng phần đang diễn ra.
          </p>
        </Card>
      )}

      {/* Results */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {/* Overview Scores */}
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: 24 }}>
                <ScoreCircle score={analysisResult.overall_score ?? 0} size={90} label="Điểm Tổng Thể" />
                <ScoreCircle score={analysisResult.ats_score ?? 0} size={90} label="ATS Score" />
              </Card>

              <Card>
                <h3 className="text-heading-sm" style={{ fontSize: 20, marginBottom: 16 }}>
                  Điểm thành phần
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.entries(analysisResult.sections || {}).map(([key, sec]: [string, any]) => (
                    <div key={key}>
                      <ProgressBar
                        value={(sec?.score || 0) * 10}
                        label={key.toUpperCase()}
                        showValue
                      />
                      {sec?.feedback && (
                        <p className="text-caption" style={{ color: 'var(--color-ash)', marginTop: 2 }}>
                          {sec.feedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Card>
                <h3 className="text-heading-sm" style={{ fontSize: 20, color: 'var(--color-success)', marginBottom: 16 }}>
                  Điểm mạnh
                </h3>
                <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(analysisResult.strengths || []).map((str: string, i: number) => (
                    <li key={i} className="text-body" style={{ color: 'var(--color-charcoal)', fontSize: 14 }}>
                      {str}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h3 className="text-heading-sm" style={{ fontSize: 20, color: 'var(--color-warning)', marginBottom: 16 }}>
                  Cần cải thiện
                </h3>
                <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(analysisResult.critical_issues || []).map((issue: string, i: number) => (
                    <li key={i} className="text-body" style={{ color: 'var(--color-charcoal)', fontSize: 14 }}>
                      {issue}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Rewrite Suggestions */}
            {analysisResult.rewrite_suggestions?.length > 0 && (
              <Card>
                <h3 className="text-heading-sm" style={{ fontSize: 20, marginBottom: 20 }}>
                  Gợi ý điều chỉnh văn phong từ AI
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {analysisResult.rewrite_suggestions.map((item: any, i: number) => (
                    <div key={i} className="card-linen" style={{ padding: 16 }}>
                      <div style={{ marginBottom: 6 }}>
                        <Badge variant="error">Nội dung gốc</Badge>
                        <p className="text-body" style={{ marginTop: 4, color: 'var(--color-ash)', fontStyle: 'italic', fontSize: 14 }}>
                          "{item.original}"
                        </p>
                      </div>
                      <div style={{ marginBottom: 6 }}>
                        <Badge variant="success">Gợi ý AI</Badge>
                        <p className="text-body" style={{ marginTop: 4, color: 'var(--color-graphite)', fontWeight: 500, fontSize: 14 }}>
                          "{item.improved}"
                        </p>
                      </div>
                      {item.reason && (
                        <p className="text-caption" style={{ color: 'var(--color-signal-blue)' }}>
                          Lý do: {item.reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
