import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/transactions"
        );
        setTransactions(response.data.transactions);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product ID</TableCell>
            <TableCell align="left">Title</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="left">Category</TableCell>
            <TableCell align="left">Image</TableCell>
            <TableCell align="left">Sold</TableCell>
            <TableCell align="left">Date of Sale</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{transaction._id}</TableCell>
              <TableCell align="left">{transaction.title}</TableCell>
              <TableCell align="left">${transaction.price}</TableCell>
              <TableCell align="left">{transaction.description}</TableCell>
              <TableCell align="left">{transaction.category}</TableCell>
              <TableCell align="left">
                <img
                  src={transaction.image}
                  alt={transaction.title}
                  style={{ width: "50px", height: "50px" }}
                />
              </TableCell>
              <TableCell align="left">
                {transaction.sold ? "Yes" : "No"}
              </TableCell>
              <TableCell align="left">
                {new Date(transaction.dateOfSale).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default App;
