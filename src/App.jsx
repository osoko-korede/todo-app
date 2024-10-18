import React, { useState, useEffect } from 'react'; // Import necessary React hooks
import { MdDelete, MdEdit } from "react-icons/md"; // Import icons from react-icons for UI


function App() {
  // State to manage the list of todos, initialized from localStorage if available
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : []; // Parse and use saved todos or start with an empty list
  });

  // State to handle the text input for a new todo
  const [newTodo, setNewTodo] = useState('');

  // State to manage which filter is active (all, completed, ongoing)
  const [filter, setFilter] = useState('all');

  // State to manage the search query for filtering todos based on text
  const [searchQuery, setSearchQuery] = useState('');

  // State to temporarily hold a deleted todo in case the user wants to undo
  const [deletedTodo, setDeletedTodo] = useState(null);

  // State to control the visibility of the search input field
  const [showSearch, setShowSearch] = useState(false);


  // State to control the visibility of the date and time input field
  const [showDateTime, setShowDateTime] = useState(false);


  // States for handling due dates and times of tasks
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  // useEffect to update localStorage whenever the list of todos changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos)); // Save the current state of todos to localStorage
  }, [todos]);

  // Function to handle adding a new todo
  const handleAddTodo = () => {
    if (newTodo.trim()) { // Check if there's text to add
      const newTask = {
        text: newTodo, // Set the text of the todo
        completed: false, // New tasks are not completed by default
        dueDate: dueDate || null, // Optionally set the due date
        dueTime: dueTime || '', // Optionally set the due time
        isEditing: false // Add isEditing state to track when the task is being edited
      };

      setTodos([...todos, newTask]); // Add the new task to the list of todos
      setNewTodo(''); // Clear the input field after adding
      setDueDate(''); // Clear the due date input
      setDueTime(''); // Clear the due time input
    }
  };

  // Function to toggle the completion status of a task
  const handleToggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo // Toggle the completed state for the specific task
    );
    setTodos(updatedTodos); // Update the todos state
  };

  // Function to delete a task by its index
  const handleDeleteTodo = (index) => {
    const deleted = todos[index]; // Get the task to be deleted
    const updatedTodos = todos.filter((_, i) => i !== index); // Remove the task from the list
    setTodos(updatedTodos); // Update the state
    setDeletedTodo(deleted); // Temporarily store the deleted task for undo functionality

    // Clear the deleted task after 5 seconds if undo is not clicked
    setTimeout(() => {
      setDeletedTodo(null);
    }, 5000);
  };

  // Function to undo a deleted task
  const handleUndoDelete = () => {
    if (deletedTodo) {
      setTodos((prevTodos) => [...prevTodos, deletedTodo]); // Restore the deleted task at the end of the list
      setDeletedTodo(null); // Clear the deleted task state
    }
  };

  // Filter the todos based on the selected filter and the search query
  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all' || (filter === 'completed' && todo.completed) || (filter === 'ongoing' && !todo.completed); // Filter by completion status
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase()); // Filter by search query
    return matchesFilter && matchesSearch; // Return todos that match both the filter and the search query
  });

  // Function to handle the "Enter" key when adding a new task
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo(); // Add the task if Enter is pressed
    }
  };

  // Function to handle editing the text of a todo
  const handleEditTodo = (index, updatedText) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, text: updatedText, isEditing: false } : todo // Update the text and stop editing mode
    );
    setTodos(updatedTodos); // Update the todos state with the new text
  };

  // Function to handle when the edit button is clicked
  const handleEditClick = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, isEditing: true } : todo // Enable editing mode for the selected todo
    );
    setTodos(updatedTodos); // Update the todos state to reflect editing mode
  };

  // Function to track the input change while editing
  const handleEditChange = (e, index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, text: e.target.value } : todo // Update task text while editing
    );
    setTodos(updatedTodos); // Update the text in state without finalizing it
  };

  // Function to handle pressing "Enter" while editing a task
  const handleEditKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      const updatedText = todos[index].text; // Get the updated text from the state
      handleEditTodo(index, updatedText); // Finalize editing and save the task
    }
  };

  // JSX to render the UI
  return (
    <div className="min-h-screen p-4 flex flex-col text-black absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-7xl">To-Do List</h1>
      </div>

      {/* Display statistics for total, completed, and ongoing tasks */}
      <div className="my-4 flex gap-4 text-3xl justify-center">
        <p className='text-base text-gray-500'>
          Total Tasks: <span className='text-2xl text-violet-800 font-semibold'>{todos.length}</span>
        </p>
        <p className='text-base text-gray-500'>
          Completed: <span className='text-2xl text-violet-800 font-semibold'>{todos.filter(todo => todo.completed).length}</span>
        </p>
        <p className='text-base text-gray-500'>
          Ongoing: <span className='text-2xl text-violet-800 font-semibold'>{todos.filter(todo => !todo.completed).length}</span>
        </p>
      </div>

      

      {/* Input for adding a new task with due date and time */}
      <div className="mb-4 flex flex-col space-y-2 w-96 mx-auto">
        <input
          className="border p-2 w-full rounded border-gray-200 bg-gray-50 px-4"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown} // Add key down event to call handleAddTodo on Enter
          placeholder="Add a new task..."
        />

        <div className="flex flex-col space-x-2 justify-center items-center">
          <button
            className=" text-sm p-2 underline flex gap-2 items-center justify-center"
            onClick={() => setShowDateTime(!showDateTime)}
          >
            {showDateTime ? 'Close date and time' : ' Optional, Add date and time'}
          </button>
          

          {showDateTime && (
            <div className="flex space-x-2">
            <input
                className="border rounded border-gray-200 bg-gray-100 px-4 "
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)} // Update due date from input
              />
              <input
                className="border rounded border-gray-200 bg-gray-100 px-4"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)} // Update due time from input
              />
          </div>
          )}
        </div>

        <button className="bg-violet-600 text-white p-2 rounded font-semibold" onClick={handleAddTodo}>
          Add Task
        </button>
      </div>

      {/* Toggle for showing search input */}
      <div className="mb-4 w-96 mx-auto flex flex-col justify-center">
        <button
          className="text-sm p-2 underline flex gap-2 items-center justify-center"
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? 'Hide Search Bar' : 'Show Search Bar'}
        </button>
        {showSearch && (
          <input
            className="border p-2 rounded border-gray-200 bg-gray-50 px-4"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
          />
        )}
      </div>



      {/* Filter buttons for showing all, ongoing, or completed tasks */}
      <div className="flex mb-6 w-96 mx-auto">
        <button
          className={`px-4 py-2 flex-1 font-semibold ${filter === 'all' ? 'bg-violet-200 text-violet-600 rounded' : 'text-gray-500 bg-gray-300/0'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 flex-1 font-semibold ${filter === 'ongoing' ? 'bg-violet-200 text-violet-600 rounded' : 'text-gray-500 bg-gray-300/0'}`}
          onClick={() => setFilter('ongoing')}
        >
          Ongoing
        </button>
        <button
          className={`px-4 py-2 flex-1 font-semibold ${filter === 'completed' ? 'bg-violet-200 text-violet-600 rounded' : 'text-gray-500 bg-gray-300/0'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Render the list of filtered todos */}
      <ul className="max-w-md w-96 mx-auto">
        {filteredTodos.map((todo, index) => (
          <li
            key={index}
            className={`flex items-center justify-between bg-white p-4 mb-2 shadow rounded ${todo.completed ? 'line-through text-gray-900' : ''}`}
          >
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(index)} // Toggle completion state when checked
                />
                {todo.isEditing ? (
                  <input
                    className="border p-2 rounded border-gray-200 bg-gray-100 px-4"
                    value={todo.text}
                    onChange={(e) => handleEditChange(e, index)} // Update task text while editing
                    onKeyDown={(e) => handleEditKeyDown(e, index)} // Handle Enter key to save changes
                    onBlur={() => handleEditTodo(index, todo.text)} // Save changes on blur
                  />
                ) : (
                  <span>{todo.text}</span> // Display task text when not in edit mode
                )}
              </div>

              <div>
                {todo.dueDate && (
                  <span className="text-gray-500 ml-4 pl-1 text-sm">
                    Due: {todo.dueDate} {todo.dueTime} {/* Display due date and time if available */}
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                className="text-violet-600 hover:text-violet-900"
                onClick={() => handleEditClick(index)} // Toggle editing mode for the task
              >
                <MdEdit />
              </button>
              <button
                className="text-violet-600 hover:text-violet-900"
                onClick={() => handleDeleteTodo(index)} // Delete the task when clicked
              >
                <MdDelete />
              </button>
            </div>
          </li>
        ))}
      </ul>

        {/* Undo delete button */}
        {deletedTodo && (
          <div className="w-96 mx-auto mt-4">
            <button
              className="bg-violet-500 text-white p-2 rounded w-full"
              onClick={handleUndoDelete}
            >
              Undo Delete
            </button>
          </div>
        )}


    </div>

    
  );
}

export default App; // Export the App component for use in other parts of the project
