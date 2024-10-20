import React, { useState } from 'react';
import styles from './InputBar.module.scss';
import clsx from 'clsx';
import { Button } from '../Button';

interface Props {
  type: boolean;
  onSubmit: (title: string) => void;
}

const InputBar: React.FC<Props> = ({ type, onSubmit }) => {
  const [title, setTitle] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (type) {
      onSubmit(title);
      setTitle('');
    } else {
      onSubmit(title);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(styles.inputBar, {
        [styles.row]: type,
        [styles.column]: !type,
      })}
    >
      <input
        type='text'
        value={title}
        onChange={handleInputChange}
        placeholder={type ? 'Create new task' : 'Update task'}
        className={clsx(styles.bar, {
          [styles.marginX]: type,
          [styles.marginY]: !type,
        })}
      />
      <Button color='primary' children={type ? 'Add' : 'Save'} />
    </form>
  );
};

export default InputBar;
