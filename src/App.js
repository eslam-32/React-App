import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

//22-3-2024

const App = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [editingPart, setEditingPart] = useState(null); // State to track the part being edited
  const [editingCompany, setEditingCompany] = useState(null); // State to track the part being edited
  const apiUrl = 'https://77.92.189.102/iit_vertical_precast/api/v1/Erp.BO.PartSvc/Parts';
  const username = 'manager';
  const password = 'manager';
  const basicAuth = 'Basic ' + btoa(username + ':' + password);

  useEffect(() => {
    document.body.style.backgroundColor = '#FBF3D5';
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          timeout: 10000,
          headers: {
            Authorization: basicAuth

          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl, basicAuth]);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: basicAuth
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleButtonClick = () => {
    fetchData();
  };

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredData = data['value']?.filter(part =>
    part.PartNum.toLowerCase().includes(searchInput.toLowerCase())
  );

  const toggleEditMode = (PartNum, Company) => {
    if (editingPart === PartNum) {
      setEditingPart(null); // Disable edit mode
    } else {
      setEditingPart(PartNum); // Enable edit mode for the specified part
      setEditingCompany(Company)
    }
  };

  const updatePartDescription = async (PartNum, newDescription, Company) => {
    try {
      const testURL = `${apiUrl}/('${Company}','${PartNum}')`
      const response = await axios.patch(testURL, {
        PartDescription: newDescription
      }, {
        headers: {
          Authorization: basicAuth
        }
      });
      // Update the local state to reflect the changes
      setData(data.map(part => part.PartNum === PartNum ? { ...part, PartDescription: newDescription } : part));
      setEditingPart(null); // Disable edit mode after updating
    } catch (error) {
      console.error('Error updating part description:', error);
    }
    // Load Data After Update
    fetchData();
  };
  return (
    <div className='container my-5'>
      <button className="btn btn-primary mb-3" onClick={handleButtonClick}>Load Data</button>
      <h1 className='h1 text-center'>Parts</h1>
      <input
        type="search"
        className="form-control mb-3 bg-light rounded"
        placeholder="Search by Part Number"
        value={searchInput}
        onChange={handleSearch}
      />
      <table className="table table-dark">
        <thead>
          <tr className="table-active">
            <th scope="col">Company</th>
            <th scope="col">Part Number</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((part, index) =>
          (
            <tr key={index}>
              <td>{part.Company}</td>
              <td>{part.PartNum}</td>
              <td>
                {editingPart === part.PartNum ? (
                  <input
                    type="text"
                    defaultValue={part.PartDescription}
                    onBlur={(e) => updatePartDescription(part.PartNum, e.target.value, part.Company)}
                  />
                ) : (
                  part.PartDescription
                )}
              </td>
              <td>
                <button className='btn btn-primary' onClick={() => toggleEditMode(part.PartNum)}>
                  {editingPart === part.PartNum ? 'Save' : 'Edit'}
                </button>
              </td>
            </tr>
          )
          ) ?? <div class="bg-black text-center">Loading...</div>}
        </tbody>
      </table>
    </div>
  );
};

export default App;