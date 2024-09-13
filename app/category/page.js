"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DataGrid } from '@mui/x-data-grid';
 
export default function Home() {

  const [categoryList, setCategoryList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'order', headerName: 'Order', width: 150 },
    {
      field: 'Action', headerName: 'Action', width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button onClick={() => startEditMode(params.row)}>📝</button>
            <button onClick={() => deleteCategory(params.row)}>🗑️</button>
          </div>
        )
      }
    },
  ];

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategoryList(c);
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function handleCategoryFormSubmit(data) {
    if (editMode) {
      // Updating a category
      fetch(`${API_BASE}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchCategory()
      });
      return
    }

    // Creating a new category
    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchCategory());

  }

  function startEditMode(category) {
    reset(category);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: '',
      order: ''
    })
    setEditMode(false)
  }

  function deleteCategory(category) {
    fetch(`${API_BASE}/category`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: category._id }),
    }).then(() => fetchCategory());
  }

  return (
    <main>
      <form onSubmit={handleSubmit(handleCategoryFormSubmit)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
          <div>Category name:</div>
          <div>
            <input
              name="name"
              type="text"
              {...register("name", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div>Order:</div>
          <div>
            <input
              name="order"
              type="number"
              {...register("order", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div className="col-span-2 text-right">
            {editMode ?
              <>
                <input
                  type="submit"
                  className="italic bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  value="Update" />

                {' '}
                <button
                  onClick={() => stopEditMode()}
                  className=" italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >Cancel
                </button>
              </>
              :
              <input
                type="submit"
                value="Add"
                className="w-20 italic bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            }
          </div>
        </div>
      </form>
      <div className="ml-4">
        <h1 className="text-xl font-bold">Category ({categoryList.length})</h1>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={categoryList}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </div>
    </main>
  );
}
