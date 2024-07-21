import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout/Layout';
import moment from 'moment';
import API from '../../services/API';
import { useSelector } from 'react-redux';

const Consumer = () => {
  const { user } = useSelector(state => state.auth);
  const [data, setData] = useState([]);

  const getDonars = async () => {
    try {
      const response = await API.post('/inventory/get-inventory-hospital', {
        filters: {
          inventoryType:'out',
          hospital: user?._id,
        },
      });
      
      if (response.data?.success) {
        setData(response.data?.inventory);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDonars();
  }, []);

  return (
    <Layout>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Blood Group</th>
            <th scope="col">Inventory Type</th>
            <th scope="col">Quantity</th>
            <th scope="col">Email</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(record => (
            <tr key={record._id}>
              <td>{record.bloodGroup}</td>
              <td>{record.inventoryType}</td>
              <td>{record.quantity}</td>
              <td>{record.email}</td>
              
              <td>{moment(record.createdAt).format('DD/MM/YYYY hh:mm A')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Consumer;
