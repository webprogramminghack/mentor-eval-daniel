import React from 'react';
import styles from './EditModal.module.scss';
import clsx from 'clsx';
import InputBar from '../InputBar/InputBar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

const EditModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className={clsx(styles.modalOverlay)}>
      <div className={clsx(styles.modalContent)}>
        <button onClick={onClose} className={clsx(styles.closeButton)}>
          Close
        </button>
        <h2>Edit Task</h2>
        <InputBar type={false} onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default EditModal;
