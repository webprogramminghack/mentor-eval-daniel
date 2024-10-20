import { useEffect } from 'react';
import TodoItem from './components/TodoItem/TodoItem';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createData, fetchData } from './api';
import { todo, todoReq } from './types/todo';
import { useInView } from 'react-intersection-observer';
import { MoonLoader } from 'react-spinners';
import InputBar from './components/InputBar/InputBar';

const Todo = () => {
  // get todo
  const { ref, inView } = useInView();

  const getData = async ({ pageParam }: { pageParam: number }) => {
    try {
      const data = await fetchData('/todos', {
        // completed: true,
        page: pageParam,
        limit: 20,
        sort: 'date',
        order: 'desc',
        // nextCursor: 1,
      });
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const {
    data,
    error,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: getData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPage) => {
      const nextPage = lastPage.hasNextPage ? allPage.length + 1 : undefined;
      return nextPage;
    },
  });

  const list = data?.pages.map((data) => {
    const { todos } = data;

    return todos.map((todo: todo, index: number) => {
      if (todos.length == index + 1) {
        return <TodoItem innerRef={ref} key={todo.id} todo={todo} />;
      }
      return <TodoItem key={todo.id} todo={todo} />;
    });
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  if (status === 'pending') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error: {error.message}</p>;
  }

  // create todo
  const handleCreate = async (title: string) => {
    const newTodo: todoReq = {
      title: title,
      completed: false,
    };

    try {
      await createData('/todos', newTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <div className='content'>
      <InputBar type={true} onSubmit={handleCreate} />

      <div className='list'>{list}</div>
      {/* <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
        {isFetchingNextPage ? 'Loading' : 'Load More'}
      </button> */}
      <div className='loader'>
        {isFetchingNextPage && <MoonLoader color={'#0093dd'} size={30} />}
      </div>
    </div>
  );
};

export default Todo;
