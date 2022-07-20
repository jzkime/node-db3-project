-- Multi-Table Query Practice

-- Display the ProductName and CategoryName for all products in the database. Shows 77 records.
SELECT CategoryName, productName
FROM Category as c JOIN Product as p ON c.id = p.categoryid

-- Display the order Id and shipper CompanyName for all orders placed before August 9 2012. Shows 429 records.
SELECT o.id as order_id, companyname, orderdate 
FROM "Order" as o JOIN Shipper as sh ON o.shipvia = sh.id
WHERE OrderDate < '2012-08-09'

-- Display the name and quantity of the products ordered in order with Id 10251. Sort by ProductName. Shows 3 records.
SELECT o.Id, ProductName, Quantity FROM "Order" as o
    JOIN OrderDetail as od ON od.orderid = o.id
    JOIN Product as p ON p.id = od.productid
WHERE o.id=10251
ORDER BY ProductName

-- Display the OrderID, Customer's Company Name and the employee's LastName for every order. All columns should be labeled clearly. Displays 16,789 records.
SELECT o.id as OrderId, CompanyName, emp.lastname as EmployeeLastName FROM "Order" as o
    JOIN Customer as cust ON o.customerid = cust.id
    JOIN Employee as emp ON emp.id = o.employeeid