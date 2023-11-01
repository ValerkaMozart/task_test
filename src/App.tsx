import React, {ChangeEvent, useEffect, useState} from 'react';
import classes from './App.module.scss'
import {v4} from "uuid";
type TItemTask = {
    label: string,
    id: string,
    isDone: boolean
}

const TaskRender: React.FC<{
    task: TItemTask,
    changeHandler: (evt: ChangeEvent<HTMLInputElement>, item: TItemTask) => void
}> = React.memo((props) => {
    console.log('effect')
    return (
        <div className={classes.itemTask} style={{opacity: props.task.isDone ? '.5' : '1'}}>
            <span>{props.task.label}</span>
            {props.task.isDone ?
                <section className={classes.completedTask}>
                    Выполнено
                </section>
                :
                <section className={classes.checkboxArea}>
                    <input type="checkbox"
                           onChange={evt => props.changeHandler(evt, props.task)}
                           checked={props.task.isDone}
                    />
                </section>
            }


        </div>
    )
}, (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps))

const App: React.FC = () => {
    const [input, setInput] = useState('')
    const [tasks, setTasks] = useState<Array<TItemTask>>([])

    useEffect(() => {
        if (localStorage.getItem('tasks')) {
            setTasks(JSON.parse(localStorage.getItem('tasks') as any))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    const closeTaskHandler = (evt: ChangeEvent<HTMLInputElement>, item: TItemTask) => {
        setTasks(prev => prev.map(task => {
            if (task.id === item.id) {
                return {...task, isDone: evt.target.checked}
            }
            return task
        }))

    }

    const addTaskHandler = () => {
        const newArrTasks = [...tasks, {label: input, id: v4(), isDone: false}]
        setTasks(newArrTasks)
        setInput('')
    }

    return (
        <div className={classes.App}>
            <main>
                <article className={classes.content}>
                    <header>
                        <h4>Todo APP</h4>
                        <section>
                            <input
                                placeholder={'Впишите задачу'}
                                type="text"
                                value={input}
                                onChange={evt => setInput(evt.target.value)}
                            />
                            <button
                                disabled={!input}
                                onClick={addTaskHandler}
                            >
                                Добавить
                            </button>
                        </section>
                    </header>
                    <article className={classes.tasksAreaWrapper}>
                        <section className={classes.tasksArea}>
                            {tasks.map((task, index) => (
                                <TaskRender changeHandler={closeTaskHandler} task={task} key={task.id}/>
                            ))}
                        </section>
                    </article>
                </article>
            </main>
        </div>
    )
}

export default App;
