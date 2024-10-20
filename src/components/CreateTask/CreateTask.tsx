import React, { useState } from 'react';
import styles from './CreateTask.module.scss';
import clsx from 'clsx';
import { Button } from '../Button';
import { createData } from '@/api';
import { todoReq } from '@/types/todo';

interface Props {}

const CreateTask: React.FC<Props> = () => {
  const [title, setTitle] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTodo: todoReq = {
      title: title,
      completed: false,
    };

    try {
      await createData('/todos', newTodo);
      setTitle('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={clsx(styles.searchBar)}>
      <input
        type='text'
        value={title}
        onChange={handleInputChange}
        placeholder='Create new task'
      />
      <Button color='primary' children='Add' />
    </form>
  );
};

export default CreateTask;
