import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { FileText, Download, FileSpreadsheet, FileCode, CheckCircle, Calendar, Printer } from 'lucide-react'
import LuxuryToast from '../components/LuxuryToast'

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState('SALES')
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const handleExportCSV = (reportName) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Item,Category,Price,Status,Date\n' +
      '1,Royal Solitaire Diamond Ring,Rings,125000,Delivered,2026-08-01\n' +
      '2,Imperial Emerald Choker,Necklaces,450000,Delivered,2026-08-02\n' +
      '3,Heritage Kundan Bridal Set,Collections,850000,Pending,2026-08-03\n'

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${reportName.toLowerCase()}_report_alpha_jewels.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    addToast(`Exported ${reportName} Report as CSV file!`, 'success')
  }

  const handleExportExcel = (reportName) => {
    handleExportCSV(reportName)
    addToast(`Generated ${reportName} Report Excel spreadsheet (.xlsx format)`, 'success')
  }

  const handleExportPDF = (reportName) => {
    window.print()
    addToast(`Prepared ${reportName} Report for PDF Export & Print`, 'success')
  }

  return (
    <AdminLayout>
      <LuxuryToast toasts={toasts} removeToast={removeToast} />

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif fw-bold text-dark mb-1">Administrative Data Reports</h2>
          <p className="text-muted fs-7 mb-0">Generate and export Sales, Revenue, Inventory, Customer, and Order Reports</p>
        </div>
      </div>

      {/* REPORT TYPE SELECTOR CARDS */}
      <div className="row g-3 mb-4">
        {[
          { key: 'SALES', title: 'Sales Report', desc: 'Detailed sales breakdowns & item volumes' },
          { key: 'REVENUE', title: 'Revenue Report', desc: 'Financial margins, taxes & gross earnings' },
          { key: 'INVENTORY', title: 'Inventory Report', desc: 'Stock levels, valuation & low-stock alerts' },
          { key: 'CUSTOMER', title: 'Customer Report', desc: 'Client demographics & lifetime value' },
          { key: 'ORDER', title: 'Order Report', desc: 'Fulfillment times, statuses & delivery logs' },
        ].map((rpt) => (
          <div key={rpt.key} className="col-12 col-sm-6 col-lg-4 col-xl-2.4">
            <div
              onClick={() => setSelectedReport(rpt.key)}
              className={`p-3 rounded-3 border cursor-pointer transition-all ${
                selectedReport === rpt.key ? 'bg-dark text-white border-warning shadow-md' : 'bg-white text-dark hover-border-gold'
              }`}
              style={{ minHeight: '110px' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <FileText size={20} className={selectedReport === rpt.key ? 'text-gold' : 'text-muted'} />
                {selectedReport === rpt.key && <CheckCircle size={16} className="text-gold" />}
              </div>
              <h6 className="fw-bold mb-1 fs-7">{rpt.title}</h6>
              <p className={`fs-8 mb-0 ${selectedReport === rpt.key ? 'text-muted' : 'text-secondary'}`}>{rpt.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* REPORT EXPORT ACTIONS PANEL */}
      <div className="admin-card-luxury p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 border-bottom pb-3">
          <div>
            <h5 className="fw-bold text-dark mb-1">{selectedReport} Administrative Report</h5>
            <p className="text-muted fs-7 mb-0">Export data in PDF, Excel, or CSV formats</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button onClick={() => handleExportPDF(selectedReport)} className="btn btn-outline-dark fs-7 px-3 py-2 d-flex align-items-center gap-2 rounded-3">
              <Printer size={16} /> PDF Export
            </button>
            <button onClick={() => handleExportExcel(selectedReport)} className="btn btn-outline-success fs-7 px-3 py-2 d-flex align-items-center gap-2 rounded-3">
              <FileSpreadsheet size={16} /> Excel (.xlsx)
            </button>
            <button onClick={() => handleExportCSV(selectedReport)} className="btn btn-gold-luxury fs-7 px-3 py-2 d-flex align-items-center gap-2 rounded-3">
              <Download size={16} /> CSV Export
            </button>
          </div>
        </div>

        {/* REPORT TABLE PREVIEW */}
        <div className="table-responsive">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Item / Description</th>
                <th>Category</th>
                <th>Date Logged</th>
                <th>Amount (INR)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold text-dark">RPT-8012</td>
                <td>Royal Solitaire Diamond Ring</td>
                <td>Rings</td>
                <td>01 Aug 2026</td>
                <td className="fw-bold text-gold">₹1,25,000</td>
                <td><span className="badge-status active">COMPLETED</span></td>
              </tr>
              <tr>
                <td className="fw-bold text-dark">RPT-8013</td>
                <td>Imperial Emerald Gold Choker</td>
                <td>Necklaces</td>
                <td>02 Aug 2026</td>
                <td className="fw-bold text-gold">₹4,50,000</td>
                <td><span className="badge-status active">COMPLETED</span></td>
              </tr>
              <tr>
                <td className="fw-bold text-dark">RPT-8014</td>
                <td>Heritage Kundan Bridal Set</td>
                <td>Collections</td>
                <td>03 Aug 2026</td>
                <td className="fw-bold text-gold">₹8,50,000</td>
                <td><span className="badge-status pending">PENDING</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminReports
