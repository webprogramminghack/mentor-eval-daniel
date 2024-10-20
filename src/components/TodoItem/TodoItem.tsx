import React, { useState } from 'react';
import styles from './TodoItem.module.scss';
import clsx from 'clsx';
import { todo } from '@/types/todo';
import { deleteData, updateData } from '@/api';
import EditModal from '../EditModal/EditModal';

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  todo: todo;
  innerRef?: React.Ref<HTMLParagraphElement>;
}

const TrashIcon = () => (
  <svg
    width='25'
    height='25'
    viewBox='0 0 25 25'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M21.5 6.47998C18.17 6.14998 14.82 5.97998 11.48 5.97998C9.5 5.97998 7.52 6.07998 5.54 6.27998L3.5 6.47998'
      stroke='#292D32'
      stroke-width='1.5'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
    <path
      d='M9 5.47L9.22 4.16C9.38 3.21 9.5 2.5 11.19 2.5H13.81C15.5 2.5 15.63 3.25 15.78 4.17L16 5.47'
      stroke='#292D32'
      stroke-width='1.5'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
    <path
      d='M19.35 9.64001L18.7 19.71C18.59 21.28 18.5 22.5 15.71 22.5H9.28999C6.49999 22.5 6.40999 21.28 6.29999 19.71L5.64999 9.64001'
      stroke='#292D32'
      stroke-width='1.5'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
    <path
      d='M10.83 17H14.16'
      stroke='#292D32'
      stroke-width='1.5'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
    <path
      d='M10 13H15'
      stroke='#292D32'
      stroke-width='1.5'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
  </svg>
);

const TodoItem: React.FC<Props> = ({ todo, innerRef, ...props }) => {
  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // delete data
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await deleteData(`/todos/${todo.id}`);
    } catch (error) {
      console.error('Error delete todo:', error);
    }
  };

  // update completed
  const handleUpdateCheckbox = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const completed = event.target.checked;

    const newTodo: todo = {
      id: todo.id,
      title: todo.title,
      completed: completed,
      date: todo.date,
    };

    try {
      await updateData(`/todos/${todo.id}`, newTodo);
    } catch (error) {
      console.error('Error delete todo:', error);
    }
  };

  // update data
  const handleUpdate = async (title: string) => {
    const newTodo: todo = {
      id: todo.id,
      title: title,
      completed: todo.completed,
      date: todo.date,
    };

    try {
      await updateData(`/todos/${todo.id}`, newTodo);
      closeModal();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <>
      <div
        key={todo.id}
        ref={innerRef}
        {...props}
        className={clsx(styles.todoItem)}
      >
        <div>
          <input
            type='checkbox'
            checked={todo.completed}
            onChange={handleUpdateCheckbox}
          />
          <div onClick={openModal}>
            {todo.completed ? (
              <p style={{ textDecoration: 'line-through' }}>{todo.title}</p>
            ) : (
              <p>{todo.title}</p>
            )}
          </div>
        </div>
        <form onSubmit={handleDelete}>
          <button type='submit'>
            <TrashIcon />
          </button>
        </form>
      </div>
      <EditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleUpdate}
      />
    </>
  );
};

export default TodoItem;
