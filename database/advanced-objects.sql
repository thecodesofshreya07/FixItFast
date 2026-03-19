CREATE VIEW Customer_Booking_V AS
SELECT C.Customer_Id, C.Customer_name, B.Booking_Id, B.Booking_Date, B.Booking_Status
FROM Customer C
JOIN Booking B
ON C.Customer_Id = B.Customer_Id;
-- 
CREATE VIEW Booking_Professional_V AS
SELECT B.Booking_Id, B.Booking_Date, P.Professional_name, P.Skill
FROM Booking B
JOIN Professional P
ON B.Professional_Id = P.Professional_Id;
--
CREATE VIEW Customer_Contact_View AS
SELECT Customer_name, Address, Contact
FROM Customer;
--
CREATE VIEW Professional_Skills_View AS
SELECT Professional_name, Skill
FROM Professional;
--
CREATE VIEW Service_Details_View AS
SELECT Service_type, Service_charge
FROM Service;
--
CREATE VIEW Pending_Bookings_View AS
SELECT Booking_Id, Booking_Date, Customer_Id
FROM Booking
WHERE Booking_Status = 'Pending';

-- update queires 
UPDATE Customer
SET Address = 'Badlapur'
WHERE Customer_Id = 1;
--
UPDATE Professional
SET Skill = 'Advanced Plumbing'
WHERE Professional_Id = 101;
--
UPDATE Customer_Contact_View
SET Contact = '9876500000'
WHERE Customer_Id = 1;


SELECT * FROM Customer_Booking_V;
select * from Booking_Professional_V;
SELECT * FROM Customer_Contact_View;
SELECT * FROM Professional_Skills_View;
SELECT * FROM Service_Details_View;
SELECT * FROM Pending_Bookings_View;

select * from Customer;
Select * from professional;
select * from Customer_Contact_View;

-- Triggers 
DELIMITER $$
CREATE TRIGGER payment_check
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
IF NEW.Amount <= 0 THEN
SET MESSAGE_TEXT = 'Invalid Payment Amount';
END IF;
END$$
DELIMITER ;
-- check
select * from Payment;
INSERT INTO Payment VALUES
(500, -120, 'Cash', '2024-02-01', 302);

DELIMITER $$
CREATE TRIGGER booking_status_default
BEFORE INSERT ON Booking
FOR EACH ROW
BEGIN
IF NEW.Booking_Status IS NULL THEN
SET NEW.Booking_Status = 'Pending';
END IF;
END$$
DELIMITER ;
-- checking 
INSERT INTO Booking VALUES
(315, '2024-02-02', NULL, 1, 101);
Select * from Booking;

DELIMITER $$
CREATE TRIGGER service_charge_check
BEFORE INSERT ON Service
FOR EACH ROW
BEGIN
IF NEW.Service_charge <= 0 THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Service charge must be greater than zero';
END IF;
END$$
DELIMITER ;
-- check 
INSERT INTO Service VALUES
(211, 'Test Service', 0);

select * from Service;
SHOW TRIGGERS;


DELIMITER $$
CREATE PROCEDURE Book_Service(
IN b_id INT,
IN b_date DATE,
IN c_id INT,
IN p_id INT
)
BEGIN
INSERT INTO Booking(Booking_Id, Booking_date, Booking_Status, Customer_Id, Professional_Id)
VALUES (b_id, b_date, 'Pending', c_id, p_id);
END$$
DELIMITER ;

CALL Book_Service(320,'2024-02-10',1,101);

DELIMITER $$
CREATE PROCEDURE Update_Booking_Status(
IN b_id INT,
IN new_status VARCHAR(100)
)
BEGIN
UPDATE Booking
SET Booking_Status = new_status
WHERE Booking_Id = b_id;
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE View_Customer_Bookings(
IN c_id INT
)
BEGIN
SELECT *
FROM Booking
WHERE Customer_Id = c_id;
END$$
DELIMITER ;

CALL View_Customer_Bookings(1);

DELIMITER $$
CREATE PROCEDURE View_Payment_Details(
IN b_id INT
)
BEGIN
SELECT *
FROM Payment
WHERE Booking_Id = b_id;
END$$
DELIMITER ;

CALL View_Payment_Details(301);

DELIMITER $$
CREATE FUNCTION Get_Total_Payment(bid INT)
RETURNS INT
DETERMINISTIC
BEGIN
DECLARE total_amount INT;
SELECT Amount
INTO total_amount
FROM Payment
WHERE Booking_Id = bid;
RETURN total_amount;
END$$
DELIMITER ;

SELECT Get_Total_Payment(301);

DELIMITER $$
CREATE FUNCTION Count_Customer_Bookings(cid INT)
RETURNS INT
DETERMINISTIC
BEGIN
DECLARE total_bookings INT;
SELECT COUNT(*)
INTO total_bookings
FROM Booking
WHERE Customer_Id = cid;
RETURN total_bookings;
END$$
DELIMITER ;

SELECT Count_Customer_Bookings(1);

DELIMITER $$
CREATE FUNCTION Get_Service_Charge(sid INT)
RETURNS INT
DETERMINISTIC
BEGIN
DECLARE charge INT;
SELECT Service_charge
INTO charge
FROM Service
WHERE Service_Id = sid;
RETURN charge;
END$$
DELIMITER ;

SELECT Get_Service_Charge(201);