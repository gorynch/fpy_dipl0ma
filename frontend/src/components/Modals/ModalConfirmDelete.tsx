import React from 'react';

interface ModalConfirmDeleteProps {
    isOpen: boolean;
    name: string;
    onConfirm: () => void;
    onClose: () => void;
}

export const ModalConfirmDelete: React.FC<ModalConfirmDeleteProps> = ({ isOpen, name, onConfirm, onClose }) => {
    if (!isOpen) return null;

    return (
        <form  onSubmit={onConfirm}>
        <div className="modal fade show" style={{ display: "block" }} >
    
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Подтверждение удаления</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" 
        onClick={onClose} aria-label="Закрыть"></button>
      </div>
      <div className="modal-body">
        <p>Вы уверены, что хотите удалить?</p>{name}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-modal" 
        data-bs-dismiss="modal" onClick={onClose}>Отмена</button>
        <button type="submit" className="btn btn-danger">Удалить</button>
      </div>
    </div>
  </div>
</div>
</form>
    );
};
