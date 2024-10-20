import { useEffect } from 'react';
import TodoItem from './components/TodoItem/TodoItem';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createData, deleteData, fetchData, updateData } from './api';
import { todo, todoReq } from './types/todo';
import { useInView } from 'react-intersection-observer';
import { MoonLoader } from 'react-spinners';
import InputBar from './components/InputBar/InputBar';
import { useQueryClient } from '@tanstack/react-query';

const Todo = () => {
  const queryClient = useQueryClient();

  // create todo
  const handleCreate = async (title: string) => {
    const newTodo: todoReq = {
      title: title,
      completed: false,
    };

    try {
      const createdTodo = await createData('/todos', newTodo);

      queryClient.setQueryData(['todos'], (oldData: any) => {
        if (!oldData || !oldData.pages) {
          return {
            pages: [{ todos: [createdTodo] }],
            pageParams: [undefined],
          };
        }

        return {
          pages: oldData.pages.map((page: any, index: number) => {
            if (index === 0) {
              return {
                ...page,
                todos: [createdTodo, ...page.todos],
              };
            }
            return page;
          }),
          pageParams: oldData.pageParams,
        };
      });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // update completed
  const handleUpdateCompleted = async (todoNow: todo, completed: boolean) => {
    const newTodo: todo = {
      id: todoNow.id,
      title: todoNow.title,
      completed: completed,
      date: todoNow.date,
    };

    queryClient.setQueryData(['todos'], (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;

      return {
        pages: oldData.pages.map((page: any) => ({
          ...page,
          todos: page.todos.map((todo: todo) =>
            todo.id === todoNow.id ? newTodo : todo
          ),
        })),
        pageParams: oldData.pageParams,
      };
    });

    try {
      await updateData(`/todos/${todoNow.id}`, newTodo);
    } catch (error) {
      console.error('Error delete todo:', error);
    }
  };

  // update data
  const handleUpdate = async (todoNow: todo, title: string) => {
    const newTodo: todo = {
      id: todoNow.id,
      title: title,
      completed: todoNow.completed,
      date: todoNow.date,
    };

    queryClient.setQueryData(['todos'], (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;

      return {
        pages: oldData.pages.map((page: any) => ({
          ...page,
          todos: page.todos.map((todo: todo) =>
            todo.id === todoNow.id ? newTodo : todo
          ),
        })),
        pageParams: oldData.pageParams,
      };
    });

    try {
      await updateData(`/todos/${todoNow.id}`, newTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // delete data
  const handleDelete = async (id: string) => {
    queryClient.setQueryData(['todos'], (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;

      return {
        pages: oldData.pages.map((page: any) => ({
          ...page,
          todos: page.todos.filter((todo: todo) => todo.id !== id),
        })),
        pageParams: oldData.pageParams,
      };
    });

    try {
      await deleteData(`/todos/${id}`);
    } catch (error) {
      console.error('Error delete todo:', error);
    }
  };

  // get todo
  const { ref, inView } = useInView();

  const getData = async ({ pageParam }: { pageParam: number }) => {
    try {
      const data = await fetchData('/todos/scroll', {
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
        return (
          <TodoItem
            innerRef={ref}
            key={todo.id}
            todo={todo}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            handleUpdateCompleted={handleUpdateCompleted}
          />
        );
      }
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          handleUpdateCompleted={handleUpdateCompleted}
        />
      );
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
