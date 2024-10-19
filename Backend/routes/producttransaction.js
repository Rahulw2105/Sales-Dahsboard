// const express = require("express");
// const Transaction = require("../models/Transaction");

// const router = express.Router();

// // Helper function to convert month name to number
// const monthNameToNumber = (month) => {
//   const monthNames = {
//     January: 0,
//     February: 1,
//     March: 2,
//     April: 3,
//     May: 4,
//     June: 5,
//     July: 6,
//     August: 7,
//     September: 8,
//     October: 9,
//     November: 10,
//     December: 11,
//   };
//   return monthNames[month] !== undefined ? monthNames[month] : -1; // Return -1 if invalid month
// };

// // GET API to list transactions with search and pagination
// router.get("/", async (req, res) => {
//   const { month, search = "", page = 1, perPage = 10 } = req.query;

//   const monthNumber = monthNameToNumber(month);
//   if (monthNumber === -1) {
//     return res.status(400).json({ message: "Invalid month provided" });
//   }

//   try {
//     // Build search query
//     const query = {
//       dateOfSale: {
//         $gte: new Date(new Date().getFullYear(), monthNumber, 1),
//         $lt: new Date(new Date().getFullYear(), monthNumber + 1, 1),
//       },
//     };

//     // Check if there's a search term and add to the query
//     if (search) {
//       const searchValue = search.trim().toLowerCase(); // Convert search term to lowercase

//       // Prepare search conditions
//       query.$or = [];

//       // Add title condition
//       query.$or.push({ title: { $eq: searchValue } });

//       // Add description condition
//       query.$or.push({ description: { $eq: searchValue } });

//       // Add price condition if it's a valid number
//       const priceValue = parseFloat(searchValue);
//       if (!isNaN(priceValue)) {
//         query.$or.push({ price: priceValue });
//       }
//     }

//     const totalTransactions = await Transaction.find(query); // Count matching documents

//     const transactions = await Transaction.find(query)
//       .skip((page - 1) * perPage) // Skip based on current page
//       .limit(perPage); // Limit results per page

//     // Convert title and description in transactions to lowercase for comparison
//     const transactionsWithLowercaseFields = transactions.map((transaction) => ({
//       ...transaction.toObject(),
//       title: transaction.title.toLowerCase(),
//       description: transaction.description.toLowerCase(),
//     }));

//     res.status(200).json({
//       total: totalTransactions.length,
//       page: parseInt(page),
//       perPage: parseInt(perPage),
//       transactions: transactionsWithLowercaseFields,
//     });
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     res.status(500).json({
//       message: "Error fetching transactions",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;

const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

const monthNameToNumber = (month) => {
  const monthNames = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };
  return monthNames[month] !== undefined ? monthNames[month] : -1;
};

router.get("/", async (req, res) => {
  const { month, search = "", price, page = 1, perPage = 10 } = req.query;

  const monthNumber = monthNameToNumber(month);
  if (monthNumber === -1) {
    return res.status(400).json({ message: "Invalid month provided" });
  }

  try {
    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber + 1] },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (price) {
      query.price = parseFloat(price);
    }

    const totalTransactions = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.status(200).json({
      total: totalTransactions,
      page: parseInt(page),
      perPage: parseInt(perPage),
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      message: "Error fetching transactions",
      error: error.message,
    });
  }
});

module.exports = router;
