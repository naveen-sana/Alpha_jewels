import React from 'react'
import { AlertTriangle } from 'lucide-react'

const DeleteModal = ({ isOpen, title, itemType, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content animate-scale-up">
        <div className="delete-icon-pulse">
          <AlertTriangle size={32} />
        </div>
        <h4 className="font-serif fw-bold text-dark mb-2">Delete {itemType || 'Item'}?</h4>
        <p className="text-muted mb-4 fs-6">
          Are you sure you want to delete <span className="fw-semibold text-dark">"{title || 'this item'}"</span>? This operation will remove it permanently from the MySQL database.
        </p>

        <div className="d-flex align-items-center justify-content-center gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="btn btn-light px-4 py-2 rounded-3 fw-semibold text-muted"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn btn-danger px-4 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm"
          >
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
