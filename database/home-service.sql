-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: online home service
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `Booking_Id` int NOT NULL,
  `Booking_date` date DEFAULT NULL,
  `Booking_Status` varchar(100) DEFAULT NULL,
  `Customer_Id` int DEFAULT NULL,
  `Professional_Id` int DEFAULT NULL,
  PRIMARY KEY (`Booking_Id`),
  KEY `Customer_Id` (`Customer_Id`),
  KEY `Professional_Id` (`Professional_Id`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`Customer_Id`) REFERENCES `customer` (`Customer_Id`),
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`Professional_Id`) REFERENCES `professional` (`Professional_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (301,'2024-01-10','Completed',1,101),(302,'2024-01-11','Completed',2,102),(303,'2024-01-12','Completed',3,103),(304,'2024-01-13','Pending',4,104),(305,'2024-01-14','Completed',5,105),(306,'2024-01-15','Completed',6,106),(307,'2024-01-16','Pending',7,107),(308,'2024-01-17','Completed',8,108),(309,'2024-01-18','Completed',9,109),(310,'2024-01-19','Completed',10,110),(311,'2024-01-25','Completed',1,102),(312,'2024-02-02',NULL,1,101),(313,'2024-02-02','Pending',1,101),(315,'2024-02-02','Pending',1,101),(320,'2024-02-10','Pending',1,101);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_service`
--

DROP TABLE IF EXISTS `booking_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_service` (
  `Booking_Id` int NOT NULL,
  `Service_Id` int NOT NULL,
  PRIMARY KEY (`Booking_Id`,`Service_Id`),
  KEY `Service_Id` (`Service_Id`),
  CONSTRAINT `booking_service_ibfk_1` FOREIGN KEY (`Booking_Id`) REFERENCES `booking` (`Booking_Id`),
  CONSTRAINT `booking_service_ibfk_2` FOREIGN KEY (`Service_Id`) REFERENCES `service` (`Service_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_service`
--

LOCK TABLES `booking_service` WRITE;
/*!40000 ALTER TABLE `booking_service` DISABLE KEYS */;
INSERT INTO `booking_service` VALUES (301,201),(302,202),(303,203),(304,204),(305,205),(306,206),(307,207),(308,208),(309,209),(310,210);
/*!40000 ALTER TABLE `booking_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `Customer_Id` int NOT NULL,
  `Customer_name` varchar(50) DEFAULT NULL,
  `Address` varchar(100) DEFAULT NULL,
  `contact` varchar(50) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Customer_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'Shreya','Badlapur','9988782969',NULL),(2,'Shruti','Kalyan','9088782969',NULL),(3,'Honey','Ulhasnagar','99088782969',NULL),(4,'Riddhee','Badlapur','99888782969',NULL),(5,'Tanushka','Badlapur','99887782969',NULL),(6,'Sakshi','Diva','99884782969',NULL),(7,'Shivani','Kalyan','99828782969',NULL),(8,'Pravin','Badlapur','93988782969',NULL),(9,'Rajeev','Badlapur','993887582969',NULL),(10,'Suhani','Ambarnath','998548782969',NULL);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `Payment_Id` int NOT NULL,
  `Amount` int DEFAULT NULL,
  `Payment_mode` varchar(1000) DEFAULT NULL,
  `Payment_date` date DEFAULT NULL,
  `Booking_Id` int DEFAULT NULL,
  PRIMARY KEY (`Payment_Id`),
  KEY `Booking_Id` (`Booking_Id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`Booking_Id`) REFERENCES `booking` (`Booking_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (401,500,'UPI','2024-01-10',301),(402,600,'Card','2024-01-11',302),(403,800,'Cash','2024-01-12',303),(404,1200,'UPI','2024-01-13',304),(405,700,'Card','2024-01-14',305),(406,1500,'UPI','2024-01-15',306),(407,1000,'Cash','2024-01-16',307),(408,900,'UPI','2024-01-17',308),(409,650,'Card','2024-01-18',309),(410,1100,'Cash','2024-01-19',310);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professional`
--

DROP TABLE IF EXISTS `professional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professional` (
  `Professional_Id` int NOT NULL,
  `Professional_name` varchar(50) DEFAULT NULL,
  `Skill` varchar(1000) DEFAULT NULL,
  `Contact` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Professional_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professional`
--

LOCK TABLES `professional` WRITE;
/*!40000 ALTER TABLE `professional` DISABLE KEYS */;
INSERT INTO `professional` VALUES (101,'Amit','Plumbing','9001122334'),(102,'Rahul','Electrical','9002233445'),(103,'Suresh','Cleaning','9003344556'),(104,'Mahesh','AC Repair','9004455667'),(105,'Rakesh','Carpentry','9005566778'),(106,'Vijay','Painting','9006677889'),(107,'Anil','Pest Control','9007788990'),(108,'Kiran','Appliance Repair','9008899001'),(109,'Sunil','Water Purifier Service','9009900112'),(110,'Deepak','Home Sanitization','9010011223');
/*!40000 ALTER TABLE `professional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `Service_Id` int NOT NULL,
  `Service_type` varchar(50) DEFAULT NULL,
  `Service_charge` int DEFAULT NULL,
  PRIMARY KEY (`Service_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES (201,'Plumbing',500),(202,'Electrical',600),(203,'Cleaning',800),(204,'AC Repair',1200),(205,'Carpentry',700),(206,'Painting',1500),(207,'Pest Control',1000),(208,'Appliance Repair',900),(209,'Water Purifier Service',650),(210,'Home Sanitization',1100);
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-19 17:21:24
