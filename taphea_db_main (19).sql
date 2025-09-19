-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 18, 2025 at 06:20 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taphea_db_main`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('taphe_awards_cache_app_settings', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:4:{s:13:\"voting_active\";s:1:\"1\";s:15:\"voting_deadline\";s:16:\"2025-10-01T12:59\";s:12:\"show_winners\";s:1:\"1\";s:12:\"marathon_fee\";s:3:\"200\";}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1758211892),
('taphe_awards_cache_onesmoalexander@gmail.coma|196.249.98.171', 'i:1;', 1758210698),
('taphe_awards_cache_onesmoalexander@gmail.coma|196.249.98.171:timer', 'i:1758210698;', 1758210698);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `nomination_fee` decimal(8,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `name`, `description`, `image_path`, `slug`, `status`, `nomination_fee`, `created_at`, `updated_at`) VALUES
(110, NULL, 'A. DEPARTMENT-BASED AWARDS', NULL, NULL, 'a-department-based-awards', 'active', '0.00', '2025-08-25 03:06:30', '2025-09-04 21:46:29'),
(111, 110, 'Best Outpatient Department (OPD) of the Year', 'Recognizes an outpatient department that demonstrates excellence in service delivery, timely care, patient respect, and follow-up.', NULL, 'best-outpatient-department-opd-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:47:16'),
(112, 110, 'Best Inpatient Care Unit of the Year', 'Awarded to the ward providing top-quality patient care, cleanliness, and efficient monitoring.', NULL, 'best-inpatient-care-unit-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:42:23'),
(113, 110, 'Best Emergency Medical Services Provider', 'Honors departments or institutions that provide rapid, professional, and effective emergency medical care.', NULL, 'best-emergency-medical-services-provider', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:34:37'),
(114, 110, 'Best Surgical Department', 'Acknowledges surgical departments with outstanding safety, high success rates, innovation, and post-operative care.', NULL, 'best-surgical-department', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:49:48'),
(115, 110, 'Best Maternal and Child Health Unit', 'Recognizes units offering quality pre-natal, delivery, post-natal, and neonatal care, including management of high-risk pregnancies.', NULL, 'best-maternal-and-child-health-unit', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:46:33'),
(116, 110, 'Best Pediatric Services Department', 'Honors departments delivering exceptional child healthcare marked by compassion, expertise, and well-being monitoring.', NULL, 'best-pediatric-services-department', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:49:11'),
(117, 110, 'Best Dental Care Department', 'Recognizes dental departments providing high-quality care, patient comfort, community dental education, and safety', '', 'best-dental-care-department', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:45:47'),
(118, 110, 'Best Eye Care Unit', 'Awarded to departments providing superior eye examinations, treatments, surgeries, and services for special-needs patients.', NULL, 'best-eye-care-unit', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:36:41'),
(119, NULL, 'B. INDIVIDUAL PROFESSIONAL EXCELLENCE AWARDS', NULL, NULL, 'b-individual-professional-excellence-awards', 'active', '0.00', '2025-08-25 03:06:30', '2025-09-04 21:46:04'),
(120, 119, 'Best Doctor of the Year – Public Hospital', 'Honors doctors demonstrating professionalism, empathy, dedication, ethical conduct, and contributions to patient care and medical education.', NULL, 'best-doctor-of-the-year-public-hospital', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:53:11'),
(121, 119, 'Best Doctor of the Year – Private Hospital', 'Honors doctors demonstrating professionalism, empathy, dedication, ethical conduct, and contributions to patient care and medical education.', NULL, 'best-doctor-of-the-year-private-hospital', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:52:44'),
(122, 119, 'Best Nurse of the Year', 'Recognizes nurses with outstanding performance, compassionate patient care, efficiency, and team collaboration.', NULL, 'best-nurse-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:58:17'),
(123, 119, 'Best Clinical Officer of the Year', 'Awarded to clinical officers demonstrating exceptional service, accountability, innovation, and community engagement', NULL, 'best-clinical-officer-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:50:38'),
(124, 119, 'Best Dermatologist of the Year', 'Honors dermatologists excelling in managing skin, hair, nail, and immune-related conditions with skill, innovation, and patient care.', NULL, 'best-dermatologist-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:51:54'),
(125, 119, 'Best Pharmacist of the Year', 'Recognizes pharmacists providing professional, efficient, and patient-centered pharmaceutical care', NULL, 'best-pharmacist-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:00:09'),
(126, 119, 'Best Laboratory Technologist of the Year', 'Honors laboratory professionals ensuring accurate, high-quality diagnostic services with integrity.', NULL, 'best-laboratory-technologist-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:54:36'),
(127, 119, 'Best Nutritionist of the Year', 'Recognizes nutritionists contributing to patient wellness through expert dietary guidance and community impact.', NULL, 'best-nutritionist-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:58:48'),
(128, 119, 'Best Mental Health Specialist of the Year', 'Awarded to mental health specialists delivering compassionate, effective, and ethical mental healthcare.', NULL, 'best-mental-health-specialist-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:57:36'),
(129, 119, 'Best Pediatrician of the Year', 'Honors pediatricians offering exceptional medical care for children, supporting families, and promoting child health.', NULL, 'best-pediatrician-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:59:28'),
(130, 119, 'Best Gynecologist of the Year', 'Recognizes gynecologists providing expert reproductive healthcare, maternal support, and clinical excellence.', NULL, 'best-gynecologist-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 21:53:52'),
(131, 119, 'Best Physiotherapist of the Year', 'Honors physiotherapists delivering professional rehabilitation services that enhance patient recovery and mobility.', NULL, 'best-physiotherapist-of-the-year', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:00:54'),
(132, NULL, 'E. SPECIALIZED SERVICES AND SUPPORT AWARDS', NULL, NULL, 'e-specialized-services-and-support-awards', 'active', '0.00', '2025-08-25 03:06:30', '2025-09-04 21:47:07'),
(133, 132, 'Best Medical Laboratory Services Provider', 'Recognizes technical units delivering accurate, quality, and patient-centered lab services.', NULL, 'best-medical-laboratory-services-provider', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:10:06'),
(134, 132, 'Best Radiology and Diagnostic Services Department', 'Honors departments providing modern, high-quality diagnostic imaging and reporting services.', NULL, 'best-radiology-and-diagnostic-services-department', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:11:57'),
(135, 132, 'Best Pharmaceutical Services Unit', 'Acknowledges units providing safe, effective, and reliable pharmaceutical services to patients and the community.', NULL, 'best-pharmaceutical-services-unit', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:10:35'),
(136, 132, 'Best Physiotherapy and Rehabilitation Center', 'Recognizes centers providing professional rehabilitation, recovery, and physiotherapy services.', NULL, 'best-physiotherapy-and-rehabilitation-center', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:11:20'),
(137, 132, 'Best Health Records and ICT Department', 'Honors departments that enhance healthcare through efficient record management, ICT solutions, and patient-centered services.', NULL, 'best-health-records-and-ict-department', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:09:20'),
(138, NULL, 'C. INSTITUTIONAL AND COMMUNITY IMPACT AWARDS', NULL, NULL, 'c-institutional-and-community-impact-awards', 'active', '0.00', '2025-08-25 03:06:30', '2025-09-04 21:46:18'),
(139, 138, 'Best Pharmaceutical Company of the Year', 'Recognizes pharmaceutical companies producing quality products, ensuring nationwide availability, investing in R&D, and contributing to community health.', NULL, 'best-pharmaceutical-company-of-the-year', 'active', '500000.00', '2025-08-25 03:06:30', '2025-09-09 21:30:16'),
(140, 138, 'Best Health Insurance Company of the Year', 'Honors insurance providers offering quality health packages, efficient claims processing, customer satisfaction, wide service networks, digital innovation, and CSR in healthcare', NULL, 'best-health-insurance-company-of-the-year', 'active', '500000.00', '2025-08-25 03:06:30', '2025-09-09 22:13:27'),
(141, NULL, 'D. LEADERSHIP AND INNOVATION AWARDS', NULL, NULL, 'd-leadership-and-innovation-awards', 'active', '0.00', '2025-08-25 03:06:30', '2025-09-04 21:46:41'),
(142, 141, 'Best Health Innovator', 'Recognizes individuals or institutions introducing technological or institutional innovations that transform healthcare delivery.', NULL, 'best-health-innovator', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:14:32'),
(143, 141, 'Best Use of Technology in Healthcare', 'Honors innovative application of technology to improve efficiency, patient care, and healthcare management.', NULL, 'best-use-of-technology-in-healthcare', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:15:40'),
(144, 141, 'Best Leadership in Health Sector', 'Acknowledges individuals demonstrating outstanding leadership, vision, and impact in the health sector.', NULL, 'best-leadership-in-health-sector', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:14:56'),
(145, 141, 'Outstanding Woman in Health', 'Celebrates women making exceptional contributions to healthcare through leadership, innovation, and service', NULL, 'outstanding-woman-in-health', 'active', '100000.00', '2025-08-25 03:06:30', '2025-09-09 22:16:20'),
(146, 141, 'Emerging Health Professional (Under 35 Years)', NULL, NULL, 'emerging-health-professional-under-35-years', 'active', '0.00', '2025-08-25 03:06:30', '2025-08-25 03:06:30'),
(151, 138, 'Best Hospital of The Year', 'Recognizes a hospital that delivers excellent patient care, improves health outcomes, and makes a positive impact on the community.', NULL, 'best-hospital-of-the-year', 'active', '500000.00', '2025-09-05 00:16:22', '2025-09-09 21:30:51'),
(152, 110, 'Best Executive & VIP Health Service Provider', 'Recognizes exceptional, personalized care and premium medical services to executives and VIP patients, ensuring comfort, efficiency, and high-quality healthcare.', NULL, 'best-executive-vip-health-service-provider', 'active', '100000.00', '2025-09-05 00:20:38', '2025-09-09 21:43:30');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `failed_jobs`
--

INSERT INTO `failed_jobs` (`id`, `uuid`, `connection`, `queue`, `payload`, `exception`, `failed_at`) VALUES
(2, '3123bf88-2fd1-4cc1-a4f9-3b975e0db300', 'database', 'default', '{\"uuid\":\"3123bf88-2fd1-4cc1-a4f9-3b975e0db300\",\"displayName\":\"App\\\\Notifications\\\\NewMarathonRegistration\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:41:\\\"App\\\\Notifications\\\\NewMarathonRegistration\\\":2:{s:15:\\\"\\u0000*\\u0000registration\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:31:\\\"App\\\\Models\\\\MarathonRegistration\\\";s:2:\\\"id\\\";i:6;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"id\\\";s:36:\\\"d32e2549-ae0d-4e8e-8526-ddfb77b140a7\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\"},\"createdAt\":1758155071,\"delay\":null}', 'Symfony\\Component\\Mailer\\Exception\\UnexpectedResponseException: Expected response code \"250/251/252\" but got code \"550\", with message \"550 No Such User Here\". in C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php:342\nStack trace:\n#0 C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php(198): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->assertResponseCode(\'550 No Such Use...\', Array)\n#1 C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\mailer\\Transport\\Smtp\\EsmtpTransport.php(150): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->executeCommand(\'RCPT TO:<suppor...\', Array)\n#2 C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php(268): Symfony\\Component\\Mailer\\Transport\\Smtp\\EsmtpTransport->executeCommand(\'RCPT TO:<suppor...\', Array)\n#3 C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php(217): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->doRcptToCommand(\'support@tapheaw...\')\n#4 C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\mailer\\Transport\\AbstractTransport.php(69): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->doSend(Object(Symfony\\Component\\Mailer\\SentMessage))\n#5 C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php(138): Symfony\\Component\\Mailer\\Transport\\AbstractTransport->send(Object(Symfony\\Component\\Mime\\Email), Object(Symfony\\Component\\Mailer\\DelayedEnvelope))\n#6 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailer.php(584): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->send(Object(Symfony\\Component\\Mime\\Email), Object(Symfony\\Component\\Mailer\\DelayedEnvelope))\n#7 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailer.php(331): Illuminate\\Mail\\Mailer->sendSymfonyMessage(Object(Symfony\\Component\\Mime\\Email))\n#8 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\Channels\\MailChannel.php(66): Illuminate\\Mail\\Mailer->send(Object(Closure), Array, Object(Closure))\n#9 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(159): Illuminate\\Notifications\\Channels\\MailChannel->send(Object(App\\Models\\User), Object(App\\Notifications\\NewMarathonRegistration))\n#10 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(116): Illuminate\\Notifications\\NotificationSender->sendToNotifiable(Object(App\\Models\\User), \'19e321b8-8846-4...\', Object(App\\Notifications\\NewMarathonRegistration), \'mail\')\n#11 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Notifications\\NotificationSender->Illuminate\\Notifications\\{closure}()\n#12 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(111): Illuminate\\Notifications\\NotificationSender->withLocale(NULL, Object(Closure))\n#13 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\ChannelManager.php(54): Illuminate\\Notifications\\NotificationSender->sendNow(Object(Illuminate\\Database\\Eloquent\\Collection), Object(App\\Notifications\\NewMarathonRegistration), Array)\n#14 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\SendQueuedNotifications.php(118): Illuminate\\Notifications\\ChannelManager->sendNow(Object(Illuminate\\Database\\Eloquent\\Collection), Object(App\\Notifications\\NewMarathonRegistration), Array)\n#15 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Notifications\\SendQueuedNotifications->handle(Object(Illuminate\\Notifications\\ChannelManager))\n#16 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#17 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#18 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#19 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#20 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Container\\Container->call(Array)\n#21 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#22 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#23 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#24 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(125): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Notifications\\SendQueuedNotifications), false)\n#25 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#26 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#27 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(120): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#28 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#29 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#30 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#31 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(394): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#32 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(180): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#33 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#34 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#35 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#36 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#37 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#38 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#39 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#40 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(209): Illuminate\\Container\\Container->call(Array)\n#41 C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#42 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(178): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#43 C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#44 C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#45 C:\\xampp\\htdocs\\tapheawards\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#46 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#47 C:\\xampp\\htdocs\\tapheawards\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#48 C:\\xampp\\htdocs\\tapheawards\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#49 {main}', '2025-09-18 00:24:41');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_albums`
--

CREATE TABLE `gallery_albums` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gallery_albums`
--

INSERT INTO `gallery_albums` (`id`, `name`, `slug`, `description`, `cover_image`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 'EVENT LAUNCH SEPT 2025', 'event-launch-sept-2025', 'Katika hafla hiyo, Mhe Saad Mtambule, ambaye aliwapongeza waandaaji wa tuzo hizi kwa mchango wao mkubwa katika kutambua Watoa huduma bora kwenye sekta ya afya waliokonga mioyo ya wagonjwa katika utoaji huduma bora kwa uweledi mkubwa.', 'album_covers/qdJ3t1aPqUmWqV3fY2OJG8L73QvRlofoIE6o4Tuf.jpg', 1, '2025-09-15 15:54:25', '2025-09-18 01:45:26');

-- --------------------------------------------------------

--
-- Table structure for table `guest_invitations`
--

CREATE TABLE `guest_invitations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `guest_name` varchar(255) NOT NULL,
  `guest_title` varchar(255) DEFAULT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `event_description` text DEFAULT NULL,
  `event_date` varchar(255) DEFAULT NULL,
  `event_time` varchar(255) DEFAULT NULL,
  `event_venue` varchar(255) DEFAULT NULL,
  `dress_code` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `rsvp_status` varchar(255) NOT NULL DEFAULT 'pending',
  `rsvp_at` timestamp NULL DEFAULT NULL,
  `viewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marathon_registrations`
--

CREATE TABLE `marathon_registrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `unique_code` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `race_type` varchar(255) DEFAULT NULL,
  `emergency_contact_name` varchar(255) NOT NULL,
  `emergency_contact_phone` varchar(255) NOT NULL,
  `emergency_contact_relationship` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending_payment',
  `payment_gateway_reference` varchar(255) DEFAULT NULL,
  `payment_notes` text DEFAULT NULL,
  `tshirt_size` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_06_24_192740_create_categories_table', 1),
(5, '2025_06_24_192740_create_nominees_table', 1),
(6, '2025_06_24_192741_create_votes_table', 1),
(7, '2025_07_07_140600_add_votes_count_to_nominees_table', 1),
(8, '2025_07_09_161546_add_is_admin_to_users_table', 1),
(9, '2025_07_10_124833_add_description_and_image_to_categories_table', 1),
(10, '2025_07_10_202045_rename_photo_url_to_image_path_in_nominees_table', 1),
(11, '2025_07_10_212128_add_image_path_to_categories_table', 1),
(13, '2025_07_15_195643_create_winners_table', 2),
(14, '2025_07_26_202350_add_unique_constraint_to_winners_table', 3),
(15, '2025_08_11_170415_add_fingerprint_to_votes_table', 4),
(16, '2025_08_11_182955_remove_unique_ip_from_votes_table', 5),
(17, '2025_08_11_210318_add_multifactor_fingerprint_to_votes_table', 5),
(18, '2025_08_11_210321_add_multifactor_fingerprint_to_votes_table', 6),
(19, '2025_08_11_214511_modify_votes_table_for_composite_unique_hash', 6),
(20, '2025_08_13_003432_create_personal_access_tokens_table', 7),
(21, '2025_08_14_122402_create_transactions_table', 8),
(22, '2025_08_14_122545_create_nominee_applications_table', 8),
(23, '2025_08_16_011832_add_status_to_categories_table', 9),
(24, '2025_08_25_060208_add_parent_id_to_categories_table', 10),
(25, '2025_08_26_164230_update_vote_uniqueness_for_fingerprintjs', 11),
(26, '2025_08_26_165942_add_social_links_to_nominees_table', 12),
(27, '2025_08_31_041910_create_suggestions_table', 13),
(28, '2025_09_04_235239_add_fingerprint_js_to_suggestions_table', 14),
(29, '2025_09_08_134239_create_season_awards_table', 15),
(30, '2025_09_09_035519_add_nomination_fee_to_categories_table', 16),
(31, '2025_09_10_014243_add_social_links_to_nominee_applications_table', 17),
(32, '2025_09_10_180117_add_review_fields_to_nominee_applications_table', 18),
(33, '2025_09_10_211419_create_guest_invitations_table', 19),
(34, '2025_09_10_212519_add_rsvp_to_guest_invitations_table', 19),
(35, '2025_09_11_031416_add_event_details_to_guest_invitations_table', 20),
(36, '2025_09_11_032410_add_event_description_to_guest_invitations_table', 21),
(37, '2025_09_13_235134_create_posts_table', 22),
(38, '2025_09_14_215826_create_marathon_registrations_table', 23),
(39, '2025_09_15_140044_create_gallery_albums_table', 24),
(40, '2025_09_15_140046_create_gallery_photos_table', 24),
(41, '2025_09_15_165828_create_gallery_albums_table', 25),
(42, '2025_09_15_165851_add_gallery_album_id_to_posts_table', 25),
(43, '2025_09_15_223858_create_reels_table', 26),
(44, '2025_09_16_161039_update_marathon_registration_table', 27),
(45, '2025_09_17_034918_update_marathon_registrations_table', 27),
(46, '2025_09_17_041823_add_emergency_contact_relationip_to_marathon_registrations_table', 28),
(47, '2025_09_17_050520_modify__marathon_registrations_table', 29);

-- --------------------------------------------------------

--
-- Table structure for table `nominees`
--

CREATE TABLE `nominees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `votes_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nominees`
--

INSERT INTO `nominees` (`id`, `category_id`, `name`, `bio`, `facebook_url`, `instagram_url`, `image_path`, `votes_count`, `created_at`, `updated_at`) VALUES
(195, 117, 'Onesmo Test', 'onesmoalexander@gmail.com onesmoalexander@gmail.com onesmoalexander@gmail.com', 'https://8a4b180e2ad5.ngrok-free.app/admin/nominees/195/edit', 'https://8a4b180e2ad5.ngrok-free.app/admin/nominees/195/edit', 'nominee_photos/RksrcIIk1bTirQ21GvDOXPdkw4g5uImLpxdSEfk0.jpg', 0, '2025-09-10 16:20:50', '2025-09-10 16:26:42');

-- --------------------------------------------------------

--
-- Table structure for table `nominee_applications`
--

CREATE TABLE `nominee_applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `applicant_name` varchar(255) NOT NULL,
  `applicant_phone` varchar(255) NOT NULL,
  `applicant_email` varchar(255) NOT NULL,
  `bio` text NOT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `tiktok_url` varchar(255) DEFAULT NULL,
  `photo_path` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending_payment',
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nominee_applications`
--

INSERT INTO `nominee_applications` (`id`, `user_id`, `category_id`, `applicant_name`, `applicant_phone`, `applicant_email`, `bio`, `facebook_url`, `instagram_url`, `tiktok_url`, `photo_path`, `status`, `reviewed_by`, `reviewed_at`, `rejection_reason`, `created_at`, `updated_at`) VALUES
(57, 11, 117, 'Onesmo Test', '0743331626', 'onesmoalexnader@gmail.com', 'onesmoalexander@gmail.com onesmoalexander@gmail.com onesmoalexander@gmail.com', NULL, NULL, NULL, 'nominee_photos/RksrcIIk1bTirQ21GvDOXPdkw4g5uImLpxdSEfk0.jpg', 'approved', 1, '2025-09-10 16:18:34', NULL, '2025-09-10 16:12:37', '2025-09-10 16:18:34'),
(66, 11, 118, 'onesmo', '0787491555', 'onesmoalexander@gmail.com', 'Jaza Fomu ya Maombi Jaza Fomu ya Maombi Jaza Fomu ya Maombi Jaza Fomu ya Maombi', NULL, NULL, NULL, 'nominee_photos/AX6X1yBdAis0KQGLK5zdKhq4GgjNSb3S7JL527nU.jpg', 'pending_payment', NULL, NULL, NULL, '2025-09-18 16:11:26', '2025-09-18 16:11:26');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('onesmo@example.com', '$2y$12$DZJ/aLlPY0cMpmWl.V0TAu9ZjFAuGc8n9z8GmsOkbUCjJ5N6bza5O', '2025-08-14 08:07:17');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 3, 'api-token', '6f366e689ef612e2c06c4e8fc72d70cf889db9b31dbb9930cbdd2c18daadd498', '[\"*\"]', NULL, NULL, '2025-08-13 08:24:49', '2025-08-13 08:24:49'),
(2, 'App\\Models\\User', 3, 'api-token', '3c2ad258b7a531ee79eacad3dd912d87b310d249e0b4aeea9abe8f581ead21d1', '[\"*\"]', NULL, NULL, '2025-08-13 12:08:12', '2025-08-13 12:08:12'),
(3, 'App\\Models\\User', 3, 'api-token', 'b75747cec07113f0aaeb6e91d40068eb7cf91aca2d2ff9ead654c6bd6b6eeafd', '[\"*\"]', NULL, NULL, '2025-08-13 12:14:48', '2025-08-13 12:14:48'),
(4, 'App\\Models\\User', 1, 'api-token', 'bbeca66cfb1cfdcf356c6affa0756dff9e676a9b52725fbbce77b93be6542d52', '[\"*\"]', NULL, NULL, '2025-08-13 13:59:25', '2025-08-13 13:59:25'),
(5, 'App\\Models\\User', 3, 'api-token', '80c5fc91ae237c6bf57faf83b8f5825e62061e69ebabd74eabfebf570773793e', '[\"*\"]', NULL, NULL, '2025-08-13 14:02:32', '2025-08-13 14:02:32'),
(6, 'App\\Models\\User', 3, 'api-token', 'a18506a837fcb97a2288479bae3229c4c6cf980bef925a57881b5db708929584', '[\"*\"]', NULL, NULL, '2025-08-13 14:36:51', '2025-08-13 14:36:51'),
(7, 'App\\Models\\User', 3, 'api-token', '951a0eef69f8174ff3fae51be02e7f61ec90db84e2c1696a1f7d7e9d10c7919e', '[\"*\"]', NULL, NULL, '2025-08-13 15:00:12', '2025-08-13 15:00:12'),
(8, 'App\\Models\\User', 3, 'api-token', '7fd13524e5d2f1ca3f2fceaeade7ba3e1a9aa3777c98e84601439a715ff5f716', '[\"*\"]', NULL, NULL, '2025-08-13 15:30:21', '2025-08-13 15:30:21'),
(9, 'App\\Models\\User', 3, 'api-token', '8ee9c50b639bafbbf27bb147f2bf01faedc3cfa7994b02bd6b5beaab557006c6', '[\"*\"]', NULL, NULL, '2025-08-13 16:28:48', '2025-08-13 16:28:48'),
(10, 'App\\Models\\User', 3, 'api-token', 'c866e2c7dd9454a87a6e0c2cb70e4265cc2ca6da013e04ce1303c5557dae4802', '[\"*\"]', NULL, NULL, '2025-08-13 16:32:43', '2025-08-13 16:32:43');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'update',
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `featured_image` varchar(255) DEFAULT NULL,
  `media_gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`media_gallery`)),
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `gallery_album_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `slug`, `excerpt`, `content`, `type`, `status`, `featured_image`, `media_gallery`, `published_at`, `created_at`, `updated_at`, `gallery_album_id`) VALUES
(2, 'TAPHE Awards 2025', 'taphe-awards-2025', 'TAPHE Awards 2025, tuzo maalum zinazotambua mchango wa watumishi wa kada ya afya katika jamii.', 'Mgeni rasmi katika hafla hiyo alikuwa Mkuu wa Wilaya ya Kinondoni, Mheshimiwa Saad Mtambule, ambaye alipongeza ubunifu huu na kusisitiza kuwa tuzo hizi zitatoa hamasa kubwa kwa watoa huduma za afya kuendelea kufanya kazi kwa weledi na kujituma.', 'update', 'published', 'post_images/VEJMJrep8hi5kBIXwWsgXmLl5KgXUSlC6VIIlyOR.jpg', NULL, '2025-09-12 21:00:00', '2025-09-13 23:18:34', '2025-09-16 17:43:28', NULL),
(3, 'TAPHE AWARDS EVENT LAUNCH', 'taphe-awards-event-launch', 'Tarehe 13 Septemba 2025, TAPHE Awards zimezinduliwa rasmi kwa sherehe ya kuvutia iliyofanyika katika ukumbi wa King Jada Hotel, Morocco Square Building, jijini Dar es Salaam.', 'Katika hafla hiyo, mgeni rasmi alikuwa Mkuu wa Wilaya ya Kinondoni, Mheshimiwa Saad Mtambule, ambaye aliwapongeza waandaaji wa tuzo hizi kwa mchango wao mkubwa katika kuibua na kutambua vipaji.', 'update', 'published', 'post_images/HVnMFFe20ID2WFKCFN2LxOlTmEaqllbpmIR8D6FM.jpg', NULL, '2025-09-12 18:00:00', '2025-09-13 23:20:26', '2025-09-14 02:17:37', NULL),
(4, 'Event Launch1', 'event-launch1', NULL, NULL, 'gallery', 'published', NULL, NULL, '2025-09-13 12:00:00', '2025-09-14 00:59:56', '2025-09-16 17:47:57', 1),
(6, 'Event Launch2', 'event-launch2', NULL, NULL, 'gallery', 'published', NULL, NULL, '2025-09-13 18:00:00', '2025-09-14 01:02:07', '2025-09-16 17:47:40', 1),
(7, 'Event Launch3', 'event-launch3', NULL, NULL, 'gallery', 'published', NULL, NULL, '2025-09-13 18:00:00', '2025-09-14 01:06:58', '2025-09-16 17:47:13', 1),
(10, 'Event Launch-5', 'event-launch-5', NULL, NULL, 'gallery', 'published', NULL, NULL, '2025-09-13 18:00:00', '2025-09-14 01:17:08', '2025-09-16 17:46:22', 1),
(11, 'Event Launch6', 'event-launch6', NULL, NULL, 'gallery', 'published', NULL, NULL, '2025-09-13 18:00:00', '2025-09-14 01:26:45', '2025-09-16 17:46:04', 1),
(12, 'Event Launch 9', 'event-launch-9', NULL, NULL, 'gallery', 'published', NULL, NULL, '2025-09-13 15:00:00', '2025-09-14 01:33:05', '2025-09-16 17:45:43', 1),
(14, 'Event Launch8', 'event-launch8', NULL, NULL, 'gallery', 'published', NULL, NULL, '2025-09-13 18:00:00', '2025-09-14 01:37:03', '2025-09-16 17:46:44', 1),
(15, 'Event9', 'event9', NULL, NULL, 'gallery', 'published', NULL, NULL, '2025-09-12 21:00:00', '2025-09-14 01:42:11', '2025-09-16 17:45:18', 1),
(16, 'Event 10', 'event-10', NULL, NULL, 'gallery', 'published', NULL, NULL, '2025-09-12 21:00:00', '2025-09-14 01:53:23', '2025-09-16 17:44:10', 1),
(17, 'Uzinduzi wa Tuzo za TAPHE 2025', 'uzinduzi-wa-tuzo-za-taphe-2025', 'Lengo la tuzo hizi ni kutoa fursa kwa kada ya afya, kutoa heshima na motisha kwa madaktari, wauguzi, wataalam wa maabara, na kada nyingine zote za afya wanaojitolea kuhakikisha ustawi wa jamii', 'Tuzo hizo zinalenga wadau mbalimbali wa afya, zikiwa na lengo la kutoa heshima na motisha kwa madaktari, wauguzi, wataalam wa maabara, na kada nyingine za afya wanaojitolea kuhakikisha ustawi wa jamii.', 'update', 'published', 'post_images/TeNIK6txHlvuotgdvKXyJDYlaM0FGtS4QJmh30ma.jpg', NULL, '2025-09-12 21:00:00', '2025-09-14 02:15:06', '2025-09-16 17:39:28', NULL),
(18, 'TAPHE LAUNCHIN EVENT1', 'taphe-launchin-event1', NULL, NULL, 'gallery', 'published', 'post_images/4IDZAt5b09R9BgY8OEg14qZcv5IswKKTa6EylQsk.jpg', NULL, '2025-09-12 21:00:00', '2025-09-14 02:15:56', '2025-09-15 17:53:35', 1);

-- --------------------------------------------------------

--
-- Table structure for table `reels`
--

CREATE TABLE `reels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reels`
--

INSERT INTO `reels` (`id`, `type`, `content`, `created_at`, `updated_at`) VALUES
(1, 'image', 'https://www.instagram.com/p/DOoo32CjYVx/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA%3D%3D', '2025-09-15 21:26:25', '2025-09-16 00:57:14'),
(2, 'instagram', 'https://www.instagram.com/reel/DOoUQthjUkm/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', '2025-09-15 21:29:55', '2025-09-16 02:03:37'),
(3, 'instagram', 'https://www.instagram.com/reel/DOopLHgDaXV/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==', '2025-09-15 21:37:05', '2025-09-16 00:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `season_awards`
--

CREATE TABLE `season_awards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `year` year(4) NOT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('B6MWPORGAdXnUus0Aagp9GvcgswE9A7Kijv3BBnx', 11, '196.249.98.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiUFhRQzNNMnhIMUpMYUhnRDRiU3hGbExTd1pmWFlCeU45Z29ySURZaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTg6Imh0dHBzOi8vYjlkYzA1ZjRlZjVmLm5ncm9rLWZyZWUuYXBwL2Rhc2hib2FyZC9hcHBsaWNhdGlvbnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxMTt9', 1758211918),
('eWXwlDvuMA0lDP4h6LItIewOKGFNTr3eBs4N9htK', 1, '196.249.98.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiZWFoNlF3WWJTZG5KZUhBSjRUQ1BjRnRWcjg0MUs3QkRhNGh4Z2pxbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vYjlkYzA1ZjRlZjVmLm5ncm9rLWZyZWUuYXBwL2FkbWluL2Rhc2hib2FyZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1758211230),
('MUYiqbObWnR0P49u1lEH4qHpbE9f9CpYh95CN0I8', NULL, '169.255.184.38', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmlHa2RFNlRDemNKUGlDM1E2MlAwdlRIeHR6OXJoN3NVbkx0REtIeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTc6Imh0dHBzOi8vN2I5ZGVkZjBkMGFjLm5ncm9rLWZyZWUuYXBwL21hcmF0aG9uL2NoZWNrLXN0YXR1cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1758205075);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'voting_active', '1', '2025-07-26 07:58:58', '2025-09-17 02:27:18'),
(2, 'voting_deadline', '2025-10-01T12:59', '2025-07-26 07:58:58', '2025-08-28 11:35:14'),
(3, 'show_winners', '1', '2025-07-26 17:45:45', '2025-09-17 02:27:18'),
(4, 'marathon_fee', '200', '2025-09-16 23:57:15', '2025-09-17 02:27:18');

-- --------------------------------------------------------

--
-- Table structure for table `suggestions`
--

CREATE TABLE `suggestions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `suggested_nominee_name` varchar(255) NOT NULL,
  `suggested_nominee_phone` varchar(255) DEFAULT NULL,
  `suggested_nominee_workplace` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `reason` text NOT NULL,
  `suggester_name` varchar(255) DEFAULT NULL,
  `suggester_email` varchar(255) DEFAULT NULL,
  `fingerprint_js` varchar(255) DEFAULT NULL,
  `status` enum('pending','reviewed','rejected','accepted') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suggestions`
--

INSERT INTO `suggestions` (`id`, `suggested_nominee_name`, `suggested_nominee_phone`, `suggested_nominee_workplace`, `category_id`, `reason`, `suggester_name`, `suggester_email`, `fingerprint_js`, `status`, `created_at`, `updated_at`) VALUES
(2, 'Madam sophia, Muhimbili lecture.', '0718355824', NULL, 128, 'Deeply emphasizer in mental health and one\'s advertiser to be aware about mental health.', 'Hannafi Abdallah Ngomero', NULL, '2b13ffd71ce89c51278b157b7b47da1f', 'pending', '2025-09-05 01:30:29', '2025-09-05 01:30:29'),
(3, 'SOFIA SAMSON SANGA', '0718355824', NULL, 128, 'ni mtoa huduma ya afya katika kitengo cha watu wenye shida ya afya ya akili, amekua kijitoa sana kwenye kazi yake na kuifanya kwa moyo sana, pili ni mtu aliyeleta mabadiliko baina ya wanafunzi wengi kuhusiana na maswalaa ya afya', NULL, NULL, '9685fce7f3efb6dfa9bc59c6e4553c2e', 'pending', '2025-09-05 01:35:28', '2025-09-05 01:35:28'),
(4, 'Karia Joshua Kilonzo', '0719465685', NULL, 113, 'Kufanya kazi kwa kujituma, lugha nzuri kwa wateja', NULL, NULL, '0c5b6b4a284165bcdb31d4e36ba3a113', 'pending', '2025-09-05 04:26:49', '2025-09-05 04:26:49'),
(5, 'Sophia samson sanga', '0718355824', NULL, 128, 'Kwanza anajituma also has good custormer care', 'Mwajabsaid', NULL, '1b635e1005bc6d0e705dc80ef6bc6b29', 'pending', '2025-09-05 09:05:06', '2025-09-05 09:05:06'),
(6, 'SOPHIA SANGA', '0718355824', NULL, 128, 'Best mental health influencer and educator to different groups and society', 'DIANA NZIGE', NULL, 'f0124574c83c078a962de91e3d0326c4', 'pending', '2025-09-05 09:15:42', '2025-09-05 09:15:42'),
(7, 'JOYCE THOMAS MFYUJI', '0755 752 787', NULL, 113, 'Joyce amefanya kazi katika Hospitali yaTumbi Kibaha kwa zaidi ya miaka 20 kwa weledi Mkubwa na bidii katika kazi, heshima na lugha nzuri kwa wagonjwa. Anastahili tuzo hii', NULL, NULL, 'f96671d72def3e23059dec91c2091c4b', 'pending', '2025-09-05 09:45:15', '2025-09-05 09:45:15'),
(8, 'Dr mpangala ,ekenywa hospital', NULL, NULL, 115, 'Kwasababu ni doctor bora sana na huduma zake ni nzuri na anaipendaa kazi yake hé is the best', 'Migeshi boniphace', NULL, '30fce81b71fd90ec6d13e3da30dd0daa', 'pending', '2025-09-05 10:08:18', '2025-09-05 10:08:18'),
(9, 'Dr Martin', '0765 777 912', NULL, 114, 'Yupo vizuri sana pale Hospital ya Benjamin mkapa anamhudumia vzr mgonjwa wake na kumfatilia maendeleo yake kwa kina Kwangu mimi naona he is the best among of his fellow', NULL, NULL, '06fa17576b9e254e043afc14ea591032', 'pending', '2025-09-05 10:23:49', '2025-09-05 10:23:49'),
(10, 'Sophia Sanga', '0718355824', NULL, 128, 'Sophia ni Dkt anayejiamini,na anaipenda kazi yake na anautayari wa kufanya kazi katika Mazingira yoyote,Hasa uzingatia hali halisi ya wingi wa wagonjwa katika Nchi', NULL, NULL, '061386a0308ce93c85e02c7dad748309', 'pending', '2025-09-05 12:08:26', '2025-09-05 12:08:26'),
(11, 'Sophia Samson Sanga', '0718 355824', NULL, 128, 'Ni mwalimu katika chuo kikuu MUHAS Yuko vizuri sana iwe darasani, wodini na field kwa ujumla', 'Maarifa Mussa', NULL, '3e2fb8af854aa2ac2988e13fe2d46c4f', 'pending', '2025-09-05 12:11:12', '2025-09-05 12:11:12'),
(12, 'Lucia Augustino Omar', '0714570669', NULL, 120, 'Amefanya matibabu ya operations za uzazi nyingi ustadi mkubwa', NULL, NULL, '2e35b2441918aa95f86c64a27d9c5760', 'pending', '2025-09-05 15:40:36', '2025-09-05 15:40:36'),
(13, 'Anord Charles Nyanana', '0768089431', NULL, 122, 'Is a best nurse at Muhimbili national hospital', NULL, NULL, 'deee52a40a9427fb7a38f1b7eb0a5b6b', 'pending', '2025-09-05 15:49:00', '2025-09-05 15:49:00'),
(14, 'Women_clinic24hrs', '0693330194', NULL, 130, 'Wanatoa elimu nzuri sana na tiba kupitia mitandao ya kijamii especially instagram', 'Grolinah', NULL, '869e42d685096a81ad234abc842dfa02', 'pending', '2025-09-05 18:01:29', '2025-09-05 18:01:29'),
(15, 'SOPHIA SAMSON SANGA', '+255 718 355 824', NULL, 128, 'Mbunifu,ktk kutatua changamoto za wagonjwa wa akili Mwalimu mzurikufundishwana kusimamia wanafunzi kipindiChakujifunzaKwavitendo,Anafundisha jamii katika mitandao ya kijamii ,', 'Peter kapala', NULL, 'e5875e9e6f6fca486b06a1bf6bd47716', 'pending', '2025-09-05 23:12:51', '2025-09-05 23:12:51'),
(16, 'Sofia Samson sanga', '0718355824', NULL, 128, 'Anastahili kwasababu ya mchango kubwa alio onesha katika kutoa elimu inayohusiana na afya ya akili kama mhadhiri wa muhas', NULL, NULL, '7bcd9bb782d136e90e0e6f0981fd0c04', 'pending', '2025-09-06 05:35:43', '2025-09-06 05:35:43'),
(17, 'SAMWEL KENETH MAGAWA', '0628802002', NULL, 122, 'Samwel Keneth Magawa ni Afisa Muuguzi na Muuguzi kiongozi Idara ya Magojwa ya Dharula katika hospitali ya Rufaa ya Mkoa wa Songwe. Amekuwa akitoa huduma Bora kwa Wagojwa akiwa na Karama pekee ya HudumaBorq kwa kila mgojwa anaemuhudumia piah nikiongozi', 'Gilbert Duncan', NULL, 'a55b0ce519b2a5b880509f2271fc60e7', 'pending', '2025-09-06 06:17:41', '2025-09-06 06:17:41'),
(18, 'IDara ya Dharula Songwe RRH', '+255739100089', NULL, 113, 'Idara ya Dharula Songwe RRH imekuwa ikitolewa kwa ubora na timu iliyojidhatiti wakiwa na vifaa tiba saidizi vyote vinavyohitajika na kupunguza idadi ya vifo kutoka vifo 16 kwa mwezi mpaka vifo 2 kwa mwezi', 'Samwel Magawa', NULL, 'a55b0ce519b2a5b880509f2271fc60e7', 'pending', '2025-09-06 06:21:48', '2025-09-06 06:21:48'),
(19, 'FM HEALTH CARE', '0765827148', NULL, 121, 'Care , service on time best outcomes.', NULL, NULL, '8556a17d9a9cdba550f1899104271258', 'pending', '2025-09-06 06:48:47', '2025-09-06 06:48:47'),
(20, 'Dr Vicent Tarimo', '+255754295812', NULL, 120, 'Best Dr magonjwa ya wamama', 'Lilian Kalikwenda', NULL, '7fc4215d9fbfa00c660c9eed79d47cad', 'pending', '2025-09-06 07:45:35', '2025-09-06 07:45:35'),
(21, 'Anna Kataimala', '+255767599905', NULL, 152, 'Ana kauli nzuri kwa wagonjwa anajua ka,i yake na ni zaidi ya muhudumu ana with na upendo', 'Lilian Kalikwenda', NULL, '7fc4215d9fbfa00c660c9eed79d47cad', 'pending', '2025-09-06 08:37:21', '2025-09-06 08:37:21'),
(22, 'Anna Kataimala', '0767599905', NULL, 152, 'Ni muuguzi ambaye anatoa huduma kwa kufuata miongozo. Ana lugha nzuri ya mawasiliano kwa wagonjwa. Anatoa taarifa na kuomba ruhusa kwa kila kitu anachofanya kwa mgonjwa.', NULL, NULL, 'fbcb9d7dfbbb2469a70ecd9efed48fc2', 'pending', '2025-09-06 09:03:22', '2025-09-06 09:03:22'),
(23, 'Anna Isaya Kataimala', '0767599905', NULL, 152, 'She is competent nurse with pure heart and good customer care and nursing care', 'Hapsa Haruna', NULL, '7bcd9bb782d136e90e0e6f0981fd0c04', 'pending', '2025-09-06 09:06:59', '2025-09-06 09:06:59'),
(24, 'Muhimbili/ muuguzi/ vvp / Anna kataimala', '+255767599905', NULL, 152, 'Huduma zao nzuri. Unaudumiwa Kwawakati, pasafi na ukiwa na changamoto zozote unasikilizwa. Kweli muhimbili ni hospital nzuri na huduma ni za kibigwa.', NULL, NULL, '2e35b2441918aa95f86c64a27d9c5760', 'pending', '2025-09-06 09:24:31', '2025-09-06 09:24:31'),
(25, 'Anna kataimala /vip/mnh', '0767599905', NULL, 122, 'Anatoa huduma nzuri vip', NULL, NULL, 'fccb84fc937250d3693881f401b32ff9', 'pending', '2025-09-06 09:47:47', '2025-09-06 09:47:47'),
(26, 'Secilia Robert Temba/Dcc/maternity/', '0744280240', NULL, 115, 'Huduma staha .nzuri bila ubaguz', NULL, NULL, 'fccb84fc937250d3693881f401b32ff9', 'pending', '2025-09-06 09:50:36', '2025-09-06 09:50:36'),
(27, 'Anna kataimala /vip/mnh', '0767599905', NULL, 152, 'Huduma nzuri na ya uhakika katika kitengo cha vip ..', NULL, NULL, 'fccb84fc937250d3693881f401b32ff9', 'pending', '2025-09-06 09:56:05', '2025-09-06 09:56:05'),
(28, 'Secilia Robert Temba/Dcc/maternity', '0744280240', NULL, 115, 'Ni muuguzi mzuri anafanya kazi kwa weledi na upendo mwingi , anajali wagonjwa wake', NULL, NULL, 'af403b9d0392a403448545c0fb1a1cfe', 'pending', '2025-09-06 10:05:49', '2025-09-06 10:05:49'),
(29, 'Anna kataimala', '+255 767 599 905', NULL, 152, 'She is the best nurse in vip ward with customee care swrvices', 'blandina julius', NULL, 'b579a42bcc1aae2edae4d51a5da131ea', 'pending', '2025-09-06 10:09:58', '2025-09-06 10:09:58'),
(30, 'Secilia Robart Temba', '0744280240', NULL, 115, 'Ni binti mwenye Nidhamu na kujali kazi yake kwa umakini mkubwa Sana na kujali wagonjwa.', 'Lilian Shayo', NULL, '18dcc5ca52efffd001b6369f5a3d87fb', 'pending', '2025-09-06 10:10:08', '2025-09-06 10:10:08'),
(31, 'Sevilla Robert Temba/Dcc/maternity majohe', '0744280240', NULL, 115, 'Huduma nzuri kuanzia clinic kujifungua mpaka baada ya kujifungua ukizingatia ni hospital ya serikali', 'Faidha swalehe', NULL, '9685fce7f3efb6dfa9bc59c6e4553c2e', 'pending', '2025-09-06 10:11:34', '2025-09-06 10:11:34'),
(32, 'Anna Kataimala', '+255 767 599 905', NULL, 152, 'She has been the best Health provider in her department,she deserves this award . Thank you', 'Pauline Apolinary', NULL, '72c7f7fd3846dce6e08901a6cb0078fa', 'pending', '2025-09-06 10:18:25', '2025-09-06 10:18:25'),
(33, 'Secilia Robert Temba/Dcc/maternity', '0744280240', NULL, 115, 'nimempendekeza secilia sababu nakumbuka siku ambayo mke wangu alipatwa na uchungu alipambana mpaka mke wangu alijifungua salamaa na akati kuna baadhi ya madaktari walikataa mke wangu asijifungulie kwao kutokana na hali yake ilikuwa mbaya walitaka aende amana hospitali lakn secilialikataakasemaatajifunguliaapaa', 'Abdallah salum matola', NULL, 'ab6ffe6126f06fb2aa1b8026bfbba6e0', 'pending', '2025-09-06 10:19:23', '2025-09-06 10:19:23'),
(34, 'Anna Kataimala', '+255 767 599 905', NULL, 152, 'Ana hospitality nzuri and good care giver', 'Angela Augustine', NULL, '98c5cc5412fe90e813b6a300f68dbb44', 'pending', '2025-09-06 10:24:03', '2025-09-06 10:24:03'),
(35, 'ANNA KATAIMALA', '0767599905', NULL, 152, 'Ni mtu mchapakazi kwenye sekta hiyo,ana jituma zaidi', 'FRANCIS NELSON', NULL, 'f2b3098c3aa9a3addd902ffbbfe64fd3', 'pending', '2025-09-06 10:29:48', '2025-09-06 10:29:48'),
(36, 'Secilia Robert Temba/DCC/Martenity', '0744280240', NULL, 115, 'Dada amejitoa sana kwa huduma za maternity na watoto anahudumia vizur sana kwakweli tunafurahishwa na huduma yake sana Mungu azid kumlinda', NULL, NULL, '5d4623e7cb01794aea9e39eb280e327b', 'pending', '2025-09-06 10:36:23', '2025-09-06 10:36:23'),
(37, 'Secilia Robert temba/dcc/martenity', '+255 744 280 240', NULL, 115, 'Amefanikisha kupunguza vifo vya wajawazito na watoto kupitia ufuatiliaji makini wa wajawazito, ushauri wa afya endelevu, na kutoa huduma kwa huruma na weled', 'Shahaweli mbale', NULL, '7294f70b79faf4c52df19659f392ae2a', 'pending', '2025-09-06 10:40:38', '2025-09-06 10:40:38'),
(38, 'ANNA KATAIMALA', '+255 767 599 905', NULL, 152, 'Mchapa kazi,Mcheshi ,Anajituma na anafanya kazi kwa moyo na anaonekana kuipenda sana kazi yake', NULL, NULL, '178f44b0341ff672d16d7845c709a412', 'pending', '2025-09-06 10:54:19', '2025-09-06 10:54:19'),
(39, 'Anna Kataimala', '0767599905', NULL, 152, 'Ana huduma nzuri sana zenye ethics na professionalism', 'Gimonge Jomo', NULL, '085292325c830a23bebdc41ba9650376', 'pending', '2025-09-06 10:55:25', '2025-09-06 10:55:25'),
(40, 'Secilia Robert Temba/Dcc/Maternity', '0744280240', NULL, 115, 'Anatoa huduma nzuri na kuwajali mama na watoto', NULL, NULL, '0d21ab733b4664e922fa4eafa5267a3c', 'pending', '2025-09-06 11:09:52', '2025-09-06 11:09:52'),
(41, 'Secilia Robert Temba', '+255744280240', NULL, 115, 'Good nurse, polite, humble provide qualified skill in delivery..in maternity ward', NULL, NULL, 'e032efb540f219bd25a9547e02af80ee', 'pending', '2025-09-06 11:12:49', '2025-09-06 11:12:49'),
(42, 'Dr. Vincent Tarimo', '0754 295 812', NULL, 130, 'Timely active, humble and listener Provide good healthcare during child bearing and clinics', NULL, NULL, 'e032efb540f219bd25a9547e02af80ee', 'pending', '2025-09-06 11:19:52', '2025-09-06 11:19:52'),
(43, 'Secilia Robert Temba', '0744280240', NULL, 115, 'Anatoa huduma nzuri na staha, pamoja na ufatiliaji ya afya ya mama baba na mtoto. And she\'s also a good advicate of Youth Friendly services and SRHR.', NULL, NULL, '4040eb468a39d61deadbbe8e78b982d2', 'pending', '2025-09-06 11:26:22', '2025-09-06 11:26:22'),
(44, 'Ana Kataimala', '0767599905', NULL, 152, 'Ana moyo wa upendo na huruma.Habagui wayu', 'Mwanahamisi Ally', NULL, '0306f0453c388e83e5cb32df52c7d011', 'pending', '2025-09-06 11:26:27', '2025-09-06 11:26:27'),
(45, 'Secilia Robert Temba/dcc/maternity', '0744280240', NULL, 115, 'Kwa ajili ya huduma nzuri anayoitoa katika kituo cha afya Majohe katika kitengo uzazi', 'ELIZABETH SAMWEL MOLANGO', NULL, 'fe6b94c49543a40f35ea6aed6e0ccb5e', 'pending', '2025-09-06 11:34:38', '2025-09-06 11:34:38'),
(46, 'Ana kataimala', '+255 767 599 905', NULL, 152, 'Yupo smart sana kwenye kutuhudumia wagonjwa', 'Jesca francis', NULL, '817f8b618b2033f6e66e79c18f3731b0', 'pending', '2025-09-06 11:36:20', '2025-09-06 11:36:20'),
(47, 'Sesilia Robart Temba', '0744280240', NULL, 115, 'Anahuduma nzuri sana kwa wangonjwa na watoto pia she\'s the best ever', 'Mariana temba', NULL, '59ccefef7fd8dbbe84bd88e4fcc4ce4a', 'pending', '2025-09-06 11:39:32', '2025-09-06 11:39:32'),
(48, 'Sesilia robart temba/dcc/martenity', '0744280240', NULL, 115, 'Ana bidii katika kaz , nidhamu anajali , utu', NULL, NULL, '5b1251eddbf0e423b51cbd9203b8726e', 'pending', '2025-09-06 12:13:47', '2025-09-06 12:13:47'),
(49, 'Secilia robert Temba', '0744280240', NULL, 115, 'Huduma nzuri kwa wazaz na watoto kabala na bada ya kujifungua katika hosptal ya Majohe ilala', NULL, NULL, 'b609886fc61370f5a1bb67d2b9643d70', 'pending', '2025-09-06 12:30:54', '2025-09-06 12:30:54'),
(50, 'secilia robert temba Dcc/ maternity', '0744280240', NULL, 115, 'she is just the best in what she does heaven sent', 'Anna', NULL, '9685fce7f3efb6dfa9bc59c6e4553c2e', 'pending', '2025-09-06 12:39:52', '2025-09-06 12:39:52'),
(51, 'Anna Kataimala', '+255 767 599 905', NULL, 152, 'Nimemuona mara nyingi wakati nikiwa naumwa na wakati nikiwa nauguza ndugu zangu Muhimbili,ni msikivu na anatoa hudumaKwa wakati', 'Vistus', NULL, '4ba648f5970df55399e2dee479448b2f', 'pending', '2025-09-06 14:32:48', '2025-09-06 14:32:48'),
(52, 'Anna kataimala', '0767 599 905', NULL, 122, 'Anajali Sana wagonjwa', 'Fransisca', NULL, 'd8a316f0151ba95cef47f190a9ab0096', 'pending', '2025-09-06 15:12:15', '2025-09-06 15:12:15'),
(53, 'Secilia Robert Temba/DCC/maternity', '0744280240', NULL, 115, 'Anatoa huduma nzr sn kwa mama mjamzito na watoto anajua kubembeleza sn na yupo vzr kwenye utendaj kazi', NULL, NULL, '934398a0d2ab7358bc1d44db9ebab2d6', 'pending', '2025-09-06 15:38:15', '2025-09-06 15:38:15'),
(54, 'Secilia robert temba/Dcc/maternity', '0744280240', NULL, 115, 'Anafanya kaz kwa ubora na ufanis wa hali juu anajali wagonjwa ipasavyo nimchango mkubwa katik kuleta maendeleo kwenye jamii', NULL, NULL, 'b32e37350825309af0c25696fe4c7919', 'pending', '2025-09-06 15:44:42', '2025-09-06 15:44:42'),
(55, 'Secilia Robert Temba/Dcc/Matertnity', '0744 280 240', NULL, 115, 'Alinihudumia vizuri kwa upole na unyenyekevu Mkubwa sana', NULL, NULL, 'b01a44af25887931bc5fb986ad10e6f2', 'pending', '2025-09-06 15:52:56', '2025-09-06 15:52:56'),
(56, 'Anna kataimala', '0767599905', NULL, 152, 'Ni mtoa huduma anaejituma kwa upendo na utashi wa khali ya juu utatua kila changamoto anayokutana nayo kwa makini na uwaredi wa kazi yake. Ni msikivu kwa wagonjwa.', 'Aneth', NULL, 'f1229e01bead5e3af2d8bea65604ba82', 'pending', '2025-09-07 05:15:14', '2025-09-07 05:15:14'),
(57, 'Secilia Robert Temba/DCC/Maternaty', '0744280240', NULL, 115, 'Anajituma sana awapo kazini pia anatoa huduma nzuri kwa wajawazito pia watoto wachanga', 'Hilari Donati Kinamboi', NULL, '5eebb37e9d6be55db096d48f35e0c4d8', 'pending', '2025-09-07 09:06:14', '2025-09-07 09:06:14'),
(58, 'Amos masunga', '0679654321', NULL, 120, 'Amefanya vizuri katika masomo yake', 'Pius John Dotto', NULL, 'b017fa90a59c1e32d8d19cd215a85eac', 'pending', '2025-09-07 09:29:29', '2025-09-07 09:29:29'),
(59, 'Secilia Robart Temba/ DCC/Maternity', '+255 744 280 240', NULL, 152, 'Anafanya kazi kwa uweledi, anahudumia wagonjwa vizuri na ni mchapa kazi haswaa', NULL, NULL, '93e47230af70f6a891e0ab37b847f56c', 'pending', '2025-09-07 10:12:29', '2025-09-07 10:12:29'),
(60, 'SOFIA SAMSON SANGA', '0718355824', NULL, 128, 'Ana uzoefu mkubwa wa kufundisha kuhusu afya ya akili na kutoa ushauri wenye tija', NULL, NULL, 'e3699733455daddb7d5e1cc1aab0d7c3', 'pending', '2025-09-07 10:35:41', '2025-09-07 10:35:41'),
(61, 'Secilia robert temba/DCC maternity', '0744280240', NULL, 115, 'Nampendekeza kwasababu amekuwa akitoa huduma zake vizuri,pia ni mshauri mzuri sana ana kila sifa za uhudumu', 'DIANA MTURU SAMSON', NULL, '1c66e45d49883a9e70f212d871aa90ec', 'pending', '2025-09-07 10:46:12', '2025-09-07 10:46:12'),
(62, 'SECILIA ROBERT TEMBA /DCC/MATERNITY', '0744280240', NULL, 115, 'Kazi mzuri,Huduma mzuri na salama pia wateja tunajisikia vizuri kua kwake', NULL, NULL, 'e9d34eb6ed27411ef91fba4b48bb41eb', 'pending', '2025-09-07 11:12:19', '2025-09-07 11:12:19'),
(63, 'Secilia Robert Temba', '0744280240', NULL, 115, 'Anafanya kazi vizuri,ana moyo wa kujitoa, ana wito na pia nimpenda watu', 'Boniphace charles', NULL, '70974d3e9d2a451d61a1c6ef64d3dbc4', 'pending', '2025-09-07 12:06:39', '2025-09-07 12:06:39'),
(64, 'Secilia Robert Temba/Dcc/ Martenity', '0744280240', NULL, 115, 'anatoa huduma nzuri kwa wazaz na watoto', NULL, NULL, 'e032efb540f219bd25a9547e02af80ee', 'pending', '2025-09-07 14:32:33', '2025-09-07 14:32:33'),
(65, 'Secilia Robert Temba/Dcc/Maternity', '0744280240', NULL, 115, 'Ni Mchapa kazi anaejituma anazingatia kwa weledi kazi yake ni mtumakini', NULL, NULL, '6feff1913e1bf30e1d63eb96e151be2b', 'pending', '2025-09-07 14:42:53', '2025-09-07 14:42:53'),
(66, 'Anna Kataimala', '+255 767 599 905', NULL, 152, 'Ni mchapa kazi, mkarimu, anajua kutoa huduma Kwa umakini na unaona kabisa anajua nini anafanya ( evidence-based care)', 'Shangwe', NULL, '8556a17d9a9cdba550f1899104271258', 'pending', '2025-09-07 17:23:14', '2025-09-07 17:23:14'),
(67, 'Sofia Samson Sanga', '+255718355824', NULL, 128, 'Knowledgeable, She is passionate with it, she is called to it', 'Shangwe', NULL, '8556a17d9a9cdba550f1899104271258', 'pending', '2025-09-07 17:26:54', '2025-09-07 17:26:54'),
(68, 'Cecilia Robert Tembo/DCC/Maternity', '0744280240', NULL, 115, 'Yaani uyu dada ana upendo sana pia anauruma ana wabembeleza wagonjwa mimi nikienda apo hospitali nisipo mkuta yenye naludi nyumbani tunampenda sana kwanza alingi mashaallah anatoa ushauli vizuri', 'Ivanka Hassan', NULL, 'ad5360e011ee7b6057478fd0662a6fb3', 'pending', '2025-09-08 03:16:41', '2025-09-08 03:16:41'),
(69, 'Anna Kataimala', '0767599905', NULL, 152, 'Nikiwa mgonjwa MNH VIP nilishuhudia Anna akitoa huduma kulingana na misingi ya taaluma yake. Ni mpole, mwenye kujali wagonjwa, waangalizi wao na watumishi wenzake. Anazungumza taratibu na kueleweka kirahisi, na kutimizaa mahitaji ya wagonjwa kwa wakati na kwa upendo mkubwa.', NULL, NULL, 'e8558ce6723158cedf16d46fb11d7fd3', 'pending', '2025-09-08 11:15:08', '2025-09-08 11:15:08'),
(70, 'Anna Isaya Kataimala', '0767599905', NULL, 152, 'Anafanya kazi kwa weredi anatoa huduma nzuri kwa wagonjwa na Ana lugha nzuri kwa wagonjwa', 'Zakia Merice Thadeo', NULL, '63e23348d90b432afad2c3cfde4c786a', 'pending', '2025-09-08 14:48:29', '2025-09-08 14:48:29'),
(71, 'Kitengule Regional Hospital', '0767585557', NULL, 130, 'Our Best Gynecology of the is due to the outstanding commitment to women’s health, compassionate patient care, and continuous medical excellence. The department combines advanced diagnostic and treatment technologies with highly skilled specialists who prioritize patient safety and dignity. Their', 'Dimitra George Gisdakis', NULL, '00c37d0bc97984e6dfe1ad9c6be2dd27', 'pending', '2025-09-08 15:36:51', '2025-09-08 15:36:51'),
(72, 'Kitengule Regional Hospital', '0767585557', NULL, 126, 'Kitengule Hospital’s Laboratorywasrecognized the Best of the our Lab Tech of theYear because of its accuracy, efficiency, and reliability in diagnostic services. With state-of-the-art equipment, highly trained staff, and strict quality control, the lab ensures timely results that support life-saving.', 'Dimitra George Gisdakis', NULL, '00c37d0bc97984e6dfe1ad9c6be2dd27', 'pending', '2025-09-08 15:40:32', '2025-09-08 15:40:32'),
(73, 'Kitengule Regional Hospital', '0767585557', NULL, 121, 'Recognizes our Orthopedic Surgeon of the Year for exceptional skill, dedication, and compassion in restoring mobility and improving lives. Through advanced orthopedic care and unwavering commitment to patients, he stands as a true pillar of excellence at Kitengule Hospital.\"', 'Dimitra George Gisdakis', NULL, '00c37d0bc97984e6dfe1ad9c6be2dd27', 'pending', '2025-09-08 15:43:18', '2025-09-08 15:43:18'),
(74, 'KISAKA AYUBU MRUTU', '+255 745 430 542', NULL, 122, 'Kwa kipindi chote ambacho nimekuwa nikimfahamu, Bw./Bi. Kisaka Mrutu Ayubu ameonyesha huduma za kipekee na huruma kubwa kwa wagonjwa. Mfano halisi ni jinsi alivyomtibu mgonjwa wangu kwa upendo, uvumilivu na uangalifu na kufanya kuimarika afya yake na kujihisi salama', 'NIMROD VALENTINE', NULL, '07fb40be900f035738920b51b3cac7c0', 'pending', '2025-09-08 15:49:42', '2025-09-08 15:49:42'),
(75, 'KISAKA AYUBU MRUTU', '0745430542', NULL, 122, 'Good responsibilities and generosity', NULL, NULL, '5e8ba1b9f2261c0150fe4a9015682991', 'pending', '2025-09-08 16:08:46', '2025-09-08 16:08:46'),
(76, 'KISAKA AYUBU MRUTU', '0745430542', NULL, 122, 'Demonstrates resilience, compassion, and a caring spirit that motivates both patients and colleagues.', 'FARIDI SAIDI MBOGO', NULL, '0c5b6b4a284165bcdb31d4e36ba3a113', 'pending', '2025-09-08 16:12:36', '2025-09-08 16:12:36'),
(77, 'KISAKA AYUBU MRITU', '0745 430 542', NULL, 122, 'Ni mkarimu, mpole, anafahami namnaNzuriya kuwahudumia wagonjwa.Kiufupi alinihudumiwa vizui na nimeipendaHudumayake', 'Ashraf Aishy', NULL, 'f2575083a42e2e4fc2a0785d427c2a80', 'pending', '2025-09-08 16:15:48', '2025-09-08 16:15:48'),
(78, 'KISAKA AYOUB MRUTU', '0745430542', NULL, 122, 'Alinizalisha vizuri bila changamoto', NULL, NULL, 'f96671d72def3e23059dec91c2091c4b', 'pending', '2025-09-08 16:16:36', '2025-09-08 16:16:36'),
(79, 'KISAKA AYUBU MRUTU', '+255745430542', NULL, 122, 'Alinisafisha kidonda vizuri', NULL, NULL, 'a09148902666f1943f1e3b165fbcd327', 'pending', '2025-09-08 16:34:52', '2025-09-08 16:34:52'),
(80, 'Dr Clara Makatu', '0715280936', NULL, 121, 'Ni Daktari anayejituma pia ni mzuri kufiatilia Maendeleo ya Wagonjwa wake', NULL, NULL, '85902fcc1487b6983f95d4f14b7e8e3f', 'pending', '2025-09-08 16:56:02', '2025-09-08 16:56:02'),
(81, 'KISAKA AYUBU MRUTU', '0745430542', NULL, 122, 'Anajitoa na Ana upendo kwa wagonjwa Alishauri njia bora za uzaz wampango', NULL, NULL, '740b4015f378c62500844399b40ed242', 'pending', '2025-09-08 18:26:58', '2025-09-08 18:26:58'),
(82, 'Kitengule Hospital', NULL, NULL, 151, 'The Hospital with greatest customer service to the patients, serving and providing best care to the patients', NULL, NULL, 'fdae2e4ac6f7efeea0a5f917604ff483', 'pending', '2025-09-09 01:15:25', '2025-09-09 01:15:25'),
(83, 'Kitengule Hospital', NULL, NULL, 116, 'At Kitengule Hospital you find a team of paediatricians, who knows their work, they attend the children whole heartedly with so much patience, love and compassion. They are providing the best service to their clients in deed.', NULL, NULL, 'fdae2e4ac6f7efeea0a5f917604ff483', 'pending', '2025-09-09 01:20:06', '2025-09-09 01:20:06'),
(84, 'Dr Mandela Makakala', '0712106429', NULL, 121, 'He knows and he loves his work. He attends his clients wholeheartedly with so much compassion, love and patience, he knows how to take good care of his patients and they all love him for sure', NULL, NULL, 'fdae2e4ac6f7efeea0a5f917604ff483', 'pending', '2025-09-09 01:24:13', '2025-09-09 01:24:13'),
(85, 'Clara Damascene Makatu', '+255 715 280 936', NULL, 121, 'Anajua sana kuhudumia wateja', NULL, NULL, 'f96671d72def3e23059dec91c2091c4b', 'pending', '2025-09-09 03:02:41', '2025-09-09 03:02:41'),
(86, 'KISAKA AYUBU MRUTU', '0745430542', NULL, 122, 'Alinizalisha vizuri sikupata changamoto yoyote', NULL, NULL, 'f71f0f4097bb7fe3d785a8992f6e9af7', 'pending', '2025-09-09 04:11:55', '2025-09-09 04:11:55'),
(87, 'secilia robert temba /Dcc/matenity', '0744280240', NULL, 152, 'ni mtoa huduma bora anaejari utu kwanza.alifanikisha kuokoa uhai wa mama na mtoto .pia ni mtoa huduma anaeshirikisha wenzake kwenye kaz hasa anapo ona dosari pia nidhamu yake ni kubwa sana', 'msalika ayubu', NULL, '7b08a182f39ab44591877833af206aff', 'pending', '2025-09-09 05:15:07', '2025-09-09 05:15:07'),
(88, 'Clara damascene makatu', '+255 715 280 936', NULL, 121, 'Anaijua kazzz na anapiga kazzz hana excuse ni kazz tu, anafuatilia wagonjwa wake anakesha kujua afya ya wadau wake na anafuatilia dozi yuko vizuri sanaa', NULL, NULL, '869e42d685096a81ad234abc842dfa02', 'pending', '2025-09-09 06:48:46', '2025-09-09 06:48:46'),
(89, 'Makunja  mafuru Makunja', '0759305474', NULL, 121, 'Ni daktarj Kwawakinamama anajua kutoa ushauri Kwa mgonjwa nami mchapa kazi sana', 'Joyce Patrice msele', NULL, '795abe44739a08f7a877b1b4b7bf73f2', 'pending', '2025-09-09 10:34:53', '2025-09-09 10:34:53'),
(90, 'abc', '0987654321', NULL, 123, 'wwwwwwwwwwwwww wwwwwwwwwwwwww wwwwwwwwwwwwww', NULL, NULL, '8d3d23aa683a6c018b87ea6ea92226fb', 'pending', '2025-09-09 15:49:41', '2025-09-09 15:49:41'),
(91, 'Clara Makatu', '0715280936', NULL, 121, 'Kujali wagonjwa na kufuatilia Maendeleo ya Wagonjwa wake kwa haraka', NULL, NULL, '85902fcc1487b6983f95d4f14b7e8e3f', 'pending', '2025-09-09 17:53:08', '2025-09-09 17:53:08'),
(92, 'Clara Damascene Makatu', '0715280936', NULL, 145, 'Ni Daktari anaejiamini sana', NULL, NULL, '87082a082a4bb377343c71591946c1ff', 'pending', '2025-09-09 17:58:05', '2025-09-09 17:58:05'),
(93, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Huduma zake ni nzuri na anajali sana pamoja na kufatilia mgonjwa', NULL, NULL, '87082a082a4bb377343c71591946c1ff', 'pending', '2025-09-09 18:06:08', '2025-09-09 18:06:08'),
(94, 'Dr. Clara Makatu', '0715280936', NULL, 121, 'Kufuatilia mgonjwa kwa ajili ya matibabu na utoaji wake wa ushauri', NULL, NULL, 'e97473e75944616c7fa8be6f315f808a', 'pending', '2025-09-09 18:24:22', '2025-09-09 18:24:22'),
(95, 'Dr Clara makatu', '0715280936', NULL, 121, 'Kwa kuwa uwa anafuatilia wagonjwa wake na kuwajali saana', 'Aegidius Ruteganya', NULL, 'efd69def278eda0ac23d3848f36dfd34', 'pending', '2025-09-09 18:27:49', '2025-09-09 18:27:49'),
(96, 'Dr Clara Makatu', '0715280936', NULL, 121, 'Ni Dr mwenye ubunifu katika kutoa huduma kwa wateja wake,anapenda sana kufuatilia Wateja/wagonjwa wake kuhusu matibabu yao pia anatoa ushauri kuhusu alichogundua pia ana heshima na kauli nzuri', NULL, NULL, '4d51b02461d5a3d7ced0a57273abb64d', 'pending', '2025-09-09 18:45:02', '2025-09-09 18:45:02'),
(97, 'Clara Makatu', '0715280936', NULL, 121, 'Patients follow up after treatment', NULL, NULL, '4453ab815e7e192b494905aa217c7169', 'pending', '2025-09-09 18:48:26', '2025-09-09 18:48:26'),
(98, 'Clara Makatu', '0715280936', NULL, 121, 'Husikiliza vizuri. Huonesha kujali', 'Michael Mwandezi', NULL, 'fddf57eda00d1c27089d662a924c626e', 'pending', '2025-09-10 00:05:06', '2025-09-10 00:05:06'),
(99, 'Dr Clara Damascene Makatu', '0715280936', NULL, 121, 'Uwezo wake mkubwa wa kuhudumia wagonjwa in a professional way', 'Christom Shayo', NULL, 'cbbd543601fd59b87fd092a10a90942c', 'pending', '2025-09-10 00:19:59', '2025-09-10 00:19:59'),
(100, 'Dr. Clara Makatu', '0715280936', NULL, 121, 'Kuhudumia vizuri wagonjwa wake na kufuatilia maendeleo yao', 'Khalifa Kayugwa', NULL, 'c04d3da8976e7a55f4e9ca1d745898bc', 'pending', '2025-09-10 00:40:44', '2025-09-10 00:40:44'),
(101, 'Clara Makatu', '0715280936', NULL, 121, 'Anayo uwezo mkubwa sana wa kuhudumia wagonjwa na hasa hasa kwa kujali Wagonjwa wake, Baada ya matibabu anayo kawaida ya kuwafutilia wanavyoendelea na kuwashauri zaidi.', 'John Mwendabantu', NULL, 'f0124574c83c078a962de91e3d0326c4', 'pending', '2025-09-10 01:05:05', '2025-09-10 01:05:05'),
(102, 'Clara damascene  makatu', '0715280936', NULL, 121, 'Anausikivu mzuriiiii kwa mgonjwa anashauri matumizi mazurii ya dawa', 'james mmanyi', NULL, 'efd69def278eda0ac23d3848f36dfd34', 'pending', '2025-09-10 01:05:12', '2025-09-10 01:05:12'),
(103, 'CLara Makati', '0715280936', NULL, 121, 'Anaupendo na wagonjwa,anawafatilia zaidi kwenye matatizo yao na pia ni muadilifu sana', 'Kirungi Ruteganya', NULL, '755aa65b0aa2fa42b99d83094a91ab03', 'pending', '2025-09-10 01:38:09', '2025-09-10 01:38:09'),
(104, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Huduma bora katika ufuatiliaji wa maendeleo ya wagonjwa.', NULL, NULL, '6d064d9aaf20d9e75c239c8b8c1df09a', 'pending', '2025-09-10 01:52:17', '2025-09-10 01:52:17'),
(105, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Uwezo wake wa kujali wagonjwa, kuwafatilia na kuwashauri', NULL, NULL, '28df3f080b9e6be3c51e6a813d0828ab', 'pending', '2025-09-10 01:55:49', '2025-09-10 01:55:49'),
(106, 'Dr makatu', '0715280936', NULL, 121, 'Custamer care, kujali wahonjwa , kujituma', 'Jukian Mbakizq', NULL, 'a2fd2bf3117bc04d4f457247b7182530', 'pending', '2025-09-10 02:14:29', '2025-09-10 02:14:29'),
(107, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Anahudumia vizuri wagonjwa, kwa pole na upepo, ana roho nzuri sana ni msikivu na kila gonjwa ambalo nilitibiwa naye halikuwahi kujirudia.', 'Doreen Lwegasira', NULL, '3924bdb4b34539e7b30673e817cbbcad', 'pending', '2025-09-10 02:29:19', '2025-09-10 02:29:19'),
(108, 'Dr.Clara Damascene Makatu', '0715280936', NULL, 121, 'Sababuni doctor anayejutima na kuwasikiliza wagonjwa vizuri na kuwashauri vizuri, na vili vile ni anajua wajibu wake niniKwa wagonjwa', 'Fausta', NULL, '6feff1913e1bf30e1d63eb96e151be2b', 'pending', '2025-09-10 02:39:59', '2025-09-10 02:39:59'),
(109, 'Dr Clara Mskatu', '0715 280936', NULL, 121, 'Anajali na kuhudumia wagonjwa vizuri', 'RONALD MSHANA', NULL, '8beec4a0070eaef0455d2b91efe904fe', 'pending', '2025-09-10 02:45:33', '2025-09-10 02:45:33'),
(110, 'Dr Clara Makatu', '0715280936', NULL, 121, 'Ana uwezo mkubwa wa kujali Wagonjwa wake, kuwafutilia wanavyoendelea na kuwapa ushauri wa kitaalamu', 'Theobald Temba', NULL, '70453e928ed8108b3de4732c0650e7ed', 'pending', '2025-09-10 02:54:45', '2025-09-10 02:54:45'),
(111, 'Dr. Clara Makatu', '0715280936', NULL, 121, 'Ni daktari anayejali Wagonjwa, msikivu na anatibu Wagonjwa vizuri.', NULL, NULL, '66c83873641a3bada2b4b5ac720c23ea', 'pending', '2025-09-10 03:07:31', '2025-09-10 03:07:31'),
(112, 'Clara MAKATU', '0715280936', NULL, 121, 'Uwezo wa kujali wagonjwa wake na kuwashauri', NULL, NULL, '5cb8b4d83fe8d19ad658fe4be41045a4', 'pending', '2025-09-10 03:40:07', '2025-09-10 03:40:07'),
(113, 'Dr Clara Makatu', '0715280936', NULL, 121, 'Yupo vizuri katika uwajali, kuwashauri, na kuwafuatilia wagonjwa wake.', NULL, NULL, 'b3078048b91c447e04b2340e22effe10', 'pending', '2025-09-10 03:52:53', '2025-09-10 03:52:53'),
(114, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Uwezo wake wa kusikilizana kufuatilia wagonjwawaje', 'Superius Muhamba', NULL, '4ba648f5970df55399e2dee479448b2f', 'pending', '2025-09-10 03:59:27', '2025-09-10 03:59:27'),
(115, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Mzurivwa kufatilia wagonjwa wake', 'Mameltha Kissha Mutagwaba', NULL, 'a85fbf7da12089240f5832db0246628d', 'pending', '2025-09-10 04:06:24', '2025-09-10 04:06:24'),
(116, 'Clara Damasen', '0715280936', NULL, 121, 'Kuwajali sana wagonjwa wake na pia zaidi kuwafuatilia maendeleo yao kuendelea kuwapa usgauri hata walio nje ya hospitali.', 'Costancia Rugumamu', NULL, '40d6ebfea78884897768a7b1e697cecc', 'pending', '2025-09-10 04:26:54', '2025-09-10 04:26:54'),
(117, 'CLARA MAKATU', '0715280936', NULL, 121, 'Huduma nzuri kwa wagonjwa', 'Dr Ben Mutagwaba', NULL, 'be1bbe8df268376939c0693d0473c40a', 'pending', '2025-09-10 04:32:21', '2025-09-10 04:32:21'),
(118, 'Dr Clara Makatu', '0715280936', NULL, 121, 'Daktari kijana, msikivu na makini kuhudumia mgonjwa, mshauri mzuri sana na mfuatiliaji wa maendeleo ya tiba ya mgonjwa. Udaktari kwake ni wito na si kazi tu.', 'Leon Mazigo', NULL, 'ac4dd09094b74ecd2aab7977b6911c1d', 'pending', '2025-09-10 04:40:13', '2025-09-10 04:40:13'),
(119, 'Clara Makatu', '0715280936', NULL, 121, 'Listener Cbring and goes extra miles for her patients', 'Lydia Kusiluka', NULL, '6d5e8824afa4ec923d08a7fafe32b4fd', 'pending', '2025-09-10 04:47:54', '2025-09-10 04:47:54'),
(120, 'Dr clara Makatu', '0715280936', NULL, 121, 'Ni Dr mwenye upendo kwa wagonjwa', 'Fintan Edward Chinguwile', NULL, '8fd6932ba15427e1f15e5a08f27a6c67', 'pending', '2025-09-10 04:49:43', '2025-09-10 04:49:43'),
(121, 'DR.Clara Makatu', '0715280936', NULL, 121, 'Huduma bora kutoka kwake pendi tufikapo hapo', 'BERTSON BRUNO', NULL, 'fabf3d0fb8b30fd89b4a8b4ffc417956', 'pending', '2025-09-10 04:50:21', '2025-09-10 04:50:21'),
(122, 'Clara Makatu', '0715280936', NULL, 121, 'Anasikiliza Wagonjwa na kuwahudumiaVizuri', 'Rachel', NULL, 'f96671d72def3e23059dec91c2091c4b', 'pending', '2025-09-10 04:57:05', '2025-09-10 04:57:05'),
(123, 'Private Hospital', '0715280936', NULL, 121, 'Anajituma na kufuatilia taarifa za wagonjwa wake', 'Clotilda Nyembe', NULL, 'e1ec763d9920047d67f75cbb220957d7', 'pending', '2025-09-10 04:58:45', '2025-09-10 04:58:45'),
(124, 'Dr. Clara Makatu', '0715280936', NULL, 121, 'Anawajali sana wagonjwa', 'Linus Kinyondo', NULL, '981099016c5a9fcc7789d8d185dacf38', 'pending', '2025-09-10 05:10:23', '2025-09-10 05:10:23'),
(125, 'SOFIA SAMSON SANGA', '0718355824', NULL, 128, 'She is really good for it with dealing mentalissues', NULL, NULL, 'bfec813bce6a6f729ec5862aa965ccad', 'pending', '2025-09-10 05:17:13', '2025-09-10 05:17:13'),
(126, 'Dr. Clara Makatu', NULL, NULL, 121, 'Anapenda wagonjwa na kazi yake. Anajituma sana.', 'Monica A. Kagya', NULL, '46117efa024bdd082dda089e79eaf7e8', 'pending', '2025-09-10 05:18:03', '2025-09-10 05:18:03'),
(127, 'Dr.Clara Makatu', '0715280936', NULL, 121, 'Nampendekeza kutokana na yafuatayo: 1. Ni msikivu, pia mtulivu aliposikiliza maelezo yangu mwanzo hadi mwisho. 2. Alishiriki kusikitika maumivu yangu, alinipa pole nyingihata nikajisikia furaha na faraja. 3.Alinipa ushauri wa hali ya juu kupambana na hali niliyokuwa nayo. Japo hakunijua.', 'Eng. Athaniel Kishebuka', NULL, 'a454122302b7210d01ee9c988602d191', 'pending', '2025-09-10 05:19:08', '2025-09-10 05:19:08'),
(128, 'Dr Clara  Makatu', '0715280936', NULL, 121, 'Ni best Doctor katika kuwahudumia wagonjwa na kuwafatilia maendeleo yao', 'Charles Mussula', NULL, 'a9a0d74ea2a15478b4c08888a86ef12a', 'pending', '2025-09-10 05:25:42', '2025-09-10 05:25:42'),
(129, 'Clara Makatu', '0715280936', NULL, 121, 'She is my best doctor ever', 'Credo Paul Ndimbo', NULL, '7ab6519029f3df62fe5d8da8184f8a43', 'pending', '2025-09-10 05:55:25', '2025-09-10 05:55:25'),
(130, 'Dr clara MAKATU', '0715280936', NULL, 121, 'Ni daktar mzuri mwenye uwezo wa kujali wagonjwa wake na kufuatia kufuatilia maendeleo ya mgonjwa na pale mgonjwa anapohitaj kupata matibabu zaid tofauti na yy alichokisomea huwa anatoa ushauri mzur na kumuelekeza mjonjwa sehemu sahihi ya kumuona daktar mwingine', 'Mwajey', NULL, '5cb8b4d83fe8d19ad658fe4be41045a4', 'pending', '2025-09-10 06:03:16', '2025-09-10 06:03:16'),
(131, 'DR CLARA DAMASCENE MAKATU', '+255715280936', NULL, 121, 'Ana mahusiano mazuri na wagonjwa na hupenda kufuatilia hali ya mgonjwa hata akishakuwa discharged. Hupenda kujua historia ya mgonjwa kabla ya kumuandikia dawa na humwelezea mgonjwa chanzo cha ugonjwa.', 'Prof John Ruhangisa', NULL, 'cc371895e5317f92bbd704c87fd5bb5e', 'pending', '2025-09-10 06:46:32', '2025-09-10 06:46:32'),
(132, 'Dr Clara Damascene Makatu', '0715280936', NULL, 121, 'Anamsikiliza mgonjwa kwa makini na anamjali na kumfuatilia', 'Audax Rutta', NULL, '9b858efc605a0173e543634faa3a1616', 'pending', '2025-09-10 06:52:18', '2025-09-10 06:52:18'),
(133, 'Dr. Clara Makatu', '0715280936', NULL, 121, 'Uwezo wake wa kujali Wagonjwa wake, kuwafatilia wanavyoendelea na kuwashauri.', 'Juvenalis Balige', NULL, '9bf1c483c051fb7a99098bd5ce6f94a8', 'pending', '2025-09-10 07:23:22', '2025-09-10 07:23:22'),
(134, 'Dr. Clara Makatu', '0715280936', NULL, 121, 'Anajali sana wagonjwa na anajitolea sana', NULL, NULL, 'eeed5e60e4498f9b6b3a942034f91767', 'pending', '2025-09-10 07:28:00', '2025-09-10 07:28:00'),
(135, 'DR.Kefa Wilson', '0758270126', NULL, 134, 'Ni daktari anayehudumia hospitali ya Murgwanza wilayani Ngara mkoani kagera,anajitoa sana kwa dharula zozote katika kuhudumia wagonjwa kwa moyo wa kujituma,kujitolea na bila kinyongo. He is really ideal for crosscutting medical services. I strongly recomend him for the award', 'Gordian Josephat', NULL, '48e20a503d0a900bc3e004284cce29bd', 'pending', '2025-09-10 07:33:22', '2025-09-10 07:33:22'),
(136, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Anajali wagonjwa anaowahudumia', 'John R. Barthazar', NULL, '7e9835dfdb18119d94f5529892a16ba2', 'pending', '2025-09-10 07:41:44', '2025-09-10 07:41:44'),
(137, 'Clara Makatu', '+255 715 280 936', NULL, 121, 'Huduma yake na ushauri ni vizuri sana', NULL, NULL, '981099016c5a9fcc7789d8d185dacf38', 'pending', '2025-09-10 08:01:34', '2025-09-10 08:01:34'),
(138, 'DR CLARA MAKATU', '0715280936', NULL, 121, 'Kuwajali wagonjwa bila ubaguzi', 'Justine Rwegasira', NULL, '89654f983d5e7deb2177e69105977d8b', 'pending', '2025-09-10 08:48:01', '2025-09-10 08:48:01'),
(139, 'Dr. Clara Damascene Makatu', '+255715280936', NULL, 121, 'Dr Clara Makatu ni mchapa kazi na hodari kwenye Private Hospital. Uwezo wake mkubwa kusikililiza na kujali wagonjwa wake, kuwafutilia hatua kwa hatua wanavyoendelea.', 'Josephat Masanja', NULL, 'b8c45d4531cbfd95508da0beb4c325be', 'pending', '2025-09-10 09:46:02', '2025-09-10 09:46:02'),
(140, 'DR Clara Makatu', '0715280936', NULL, 121, 'Uwezo mzuri wa kujali wagojwa wake, na kufwatilia.', 'Bavon Ndumbati', NULL, '923deeaff1230ca7c461cacb8238ad54', 'pending', '2025-09-10 09:52:25', '2025-09-10 09:52:25'),
(141, 'Dr Clara Makatu', '0715280936', NULL, 121, 'Uwezo wake wa kujali Wagonjwa wake, kuwafutilia wanavyoendelea na kuwashauri', 'Magnus Mchunguzi', NULL, '1e39b81471e6b6e92a29c7e75ef24499', 'pending', '2025-09-10 12:19:26', '2025-09-10 12:19:26'),
(142, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Anajali na kufuatilia matokeo kwa wagonjwa anawahudumia.', NULL, NULL, '299ec45bc720a37ea8e0e741b8bb6cf2', 'pending', '2025-09-10 13:56:49', '2025-09-10 13:56:49'),
(143, 'Dr Clara Damascene Makatu', '0715280936', NULL, 121, 'Dr. Clara ni bingwa wa magonjwa ya ndani mwenye huruma kwa wagonjwa. Ameboresha huduma za afya kwenye hospitali binafsi. Amenihudumia kwenye hospitali ya Kitengule na nimeridhishwa sana na huduma yake.', 'Mike Nshangeki', NULL, 'a6ec701607e30bc59f8ff93ba772b344', 'pending', '2025-09-10 15:30:03', '2025-09-10 15:30:03'),
(144, 'Dr. Clara Makatu', '0715280936', NULL, 121, 'Respectful care kwa wateja wake', 'Dr. Ruth Lemwayi', NULL, 'de056d422bf1fcd91e0f19bc2e2aeb03', 'pending', '2025-09-10 15:33:30', '2025-09-10 15:33:30'),
(145, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Anatekekeza kaziYake kwa weredimkubwa namtabiria atafika mbali', NULL, NULL, '8a8fca3db774859833889a8f39d950d5', 'pending', '2025-09-10 15:41:50', '2025-09-10 15:41:50'),
(146, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Ni mchana kazi Very Attractive', 'Adve jarvis', NULL, 'a11e642ae890c3ad003f179a3135a780', 'pending', '2025-09-10 15:58:40', '2025-09-10 15:58:40'),
(147, 'Dr Clara  Damascene Makatu', '0715280936', NULL, 121, 'Uwezo wake wa kuwajali na kuwa hudumia wagonjwa.', 'Charles Simon Nyembe', NULL, 'efac6bdd00d9e8feff5c5009d30ce730', 'pending', '2025-09-10 16:06:02', '2025-09-10 16:06:02'),
(148, 'Clara Damacene Makatu', '0715280936', NULL, 121, 'Amejitokeza kuwa daktari mjasiri na mwenye wito wa kazi yake', 'Sadi Kajuna', NULL, '40ea0ce68e0469a680abd599c7574d2f', 'pending', '2025-09-10 16:13:42', '2025-09-10 16:13:42'),
(149, 'Dr. Clara Makatu', '0715280936', NULL, 121, 'Anajali sana wagonjwa wake.', NULL, NULL, 'b7775ef615109998ec4621dc943e7147', 'pending', '2025-09-10 16:53:11', '2025-09-10 16:53:11'),
(150, 'Clara Damascene Makatu', '0715280936', NULL, 121, 'Anajali Sana maendeleo ya mgonjwa kwa kumfuatilia hata akisharuhusiwa', 'Anthony', NULL, 'c853456886b367ebd1148297b9d5543a', 'pending', '2025-09-10 17:24:47', '2025-09-10 17:24:47'),
(151, 'Dr Clara Makatu', '0715280936', NULL, 121, 'Attentiveness to patients and follow up and care', NULL, NULL, '2061fe8d46188bd0db9f260c17d0ceca', 'pending', '2025-09-10 17:29:36', '2025-09-10 17:29:36'),
(152, 'Dr Clara Makatu', '0715280936', NULL, 121, 'Anajali wagonjwa wake, anasikiliza kwa makini mgonjwa anapojieleza. Anafuatilia wagonjwa wake wote baada ya kuwapatia matibabu kujua maendeleoYao anajitumaSanakatikaKAZIyake ya utabibu.', NULL, NULL, '140e9b25a8033ff7a6bdb85287a756f2', 'pending', '2025-09-10 18:11:41', '2025-09-10 18:11:41'),
(153, 'Dr Clara Makatu', '0715280936', NULL, 121, 'Mpole. Anajali wagonjwa. Anakuhudumia kwa usikivu na anakushauri kitaalam.', NULL, NULL, '07445c7ab374633d061d7fd99d4d198d', 'pending', '2025-09-10 18:18:29', '2025-09-10 18:18:29'),
(154, 'Dr Clara Damascene Makatu', '0715280936', NULL, 121, 'Dr. Clara Damascene Makatu ni bingwa wa magonjwa ya ndani mwenye kujitolea, anayetoa huduma bora na zenye huruma kwa wagonjwa, na ametoa mchango mkubwa katika kuboresha huduma za afya kwenye hospitali binafsi Tanzania.', NULL, NULL, '169907b3c9faf0ef084bc4f1c3b28315', 'pending', '2025-09-10 18:40:42', '2025-09-10 18:40:42'),
(155, 'Dr Clara Makatu', '0715280936', NULL, 121, 'Dr. Clara is a compassionate physician who goes above and beyond to provide excellent, well-rounded care. With empathy, professionalism, and dedication, she follows up with patients to ensure their needs are met, making her truly deserving of this recognition.', NULL, NULL, 'b1bcc16d1e06c6cb08fbbbb93431f86e', 'pending', '2025-09-10 18:50:06', '2025-09-10 18:50:06'),
(156, 'Onesmo', '0987654321', NULL, 123, 'ygfla ab se a\'a bib bIJID kninors\' s nkgng ngrsobr', NULL, NULL, '8d3d23aa683a6c018b87ea6ea92226fb', 'pending', '2025-09-18 15:45:54', '2025-09-18 15:45:54');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_id` char(36) NOT NULL,
  `payable_type` varchar(255) NOT NULL,
  `payable_id` bigint(20) UNSIGNED NOT NULL,
  `gateway_reference` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'TZS',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `order_id`, `payable_type`, `payable_id`, `gateway_reference`, `amount`, `currency`, `status`, `payment_method`, `phone_number`, `notes`, `created_at`, `updated_at`) VALUES
(58, 2, '8d3baebc-dd86-412a-a7c0-705498426989', 'App\\Models\\NomineeApplication', 51, NULL, '200.00', 'TZS', 'pending', NULL, '255743331626', NULL, '2025-09-08 22:40:17', '2025-09-08 22:40:17'),
(59, 2, '46fd003f-fd30-45bc-ae75-897127f18060', 'App\\Models\\NomineeApplication', 52, '0977362719', '200.00', 'TZS', 'completed', NULL, '255743331626', 'Webhook: Payment completed successfully.', '2025-09-08 23:20:19', '2025-09-08 23:20:41'),
(60, 2, '986cf277-a950-4af8-a9af-ecdca3094adf', 'App\\Models\\NomineeApplication', 53, NULL, '200.00', 'TZS', 'pending', NULL, '255743331626', NULL, '2025-09-08 23:57:51', '2025-09-08 23:57:51'),
(61, 2, '9c50cdd9-1e22-4504-9888-5258f577f77e', 'App\\Models\\NomineeApplication', 54, NULL, '200.00', 'TZS', 'pending', NULL, '255743331626', NULL, '2025-09-09 00:19:35', '2025-09-09 00:19:35'),
(62, 2, '852830f8-1f46-4890-8782-e8aa7c44aa73', 'App\\Models\\NomineeApplication', 55, NULL, '500000.00', 'TZS', 'pending', NULL, '255743331626', NULL, '2025-09-09 23:18:05', '2025-09-09 23:18:05'),
(63, 11, '3b304614-5205-44aa-a140-20db276ba1d1', 'App\\Models\\NomineeApplication', 56, '0978026079', '200.00', 'TZS', 'completed', NULL, '255743331626', 'Webhook: Payment completed successfully.', '2025-09-10 14:24:42', '2025-09-10 14:26:02'),
(64, 11, '97b93184-3ed1-4fd9-a09e-3a88ce73fee0', 'App\\Models\\NomineeApplication', 57, '0978079701', '200.00', 'TZS', 'completed', NULL, '255743331626', 'Webhook: Payment completed successfully.', '2025-09-10 16:12:37', '2025-09-10 16:13:12'),
(65, 11, 'ca701987-3c8b-4f05-94f3-838f0258b0d3', 'App\\Models\\NomineeApplication', 58, NULL, '200.00', 'TZS', 'pending', NULL, '255787491555', NULL, '2025-09-10 16:43:39', '2025-09-10 16:43:39'),
(66, NULL, 'e8f6fc06-73b3-4529-871b-bdbe71b72386', 'App\\Models\\MarathonRegistration', 1, NULL, '5000.00', 'TZS', 'initiation_failed', NULL, '255743331626', 'API call failed: {\"status\":\"error\",\"step\":\"order_creation\",\"message\":\"Validation failed\",\"errors\":{\"buyer_email\":[\"This field may not be null.\"],\"buyer_name\":[\"This field may not be null.\"]}}', '2025-09-17 02:10:41', '2025-09-17 02:10:42'),
(67, 1, '44ce7f2f-f5c1-4448-892c-9fb7671ddc91', 'App\\Models\\MarathonRegistration', 2, NULL, '200.00', 'TZS', 'initiation_failed', NULL, '255743331626', 'API call failed: {\"status\":\"error\",\"step\":\"order_creation\",\"message\":\"Validation failed\",\"errors\":{\"buyer_email\":[\"This field may not be null.\"],\"buyer_name\":[\"This field may not be null.\"]}}', '2025-09-17 02:30:26', '2025-09-17 02:30:27'),
(68, 1, 'a2cfbc2e-2e35-43db-92d6-c56d45cddaf7', 'App\\Models\\MarathonRegistration', 3, NULL, '200.00', 'TZS', 'initiation_failed', NULL, '255743331626', 'API call failed: {\"status\":\"error\",\"step\":\"order_creation\",\"message\":\"Validation failed\",\"errors\":{\"buyer_email\":[\"This field may not be null.\"],\"buyer_name\":[\"This field may not be null.\"]}}', '2025-09-17 02:32:38', '2025-09-17 02:32:40'),
(69, 11, 'ef70bf09-8948-4702-aa9b-72c03c7c71b0', 'App\\Models\\NomineeApplication', 59, NULL, '100000.00', 'TZS', 'initiation_failed', NULL, '255743331626', 'API call failed: {\"status\":\"error\",\"step\":\"order_creation\",\"message\":\"Validation failed\",\"errors\":{\"buyer_email\":[\"This field may not be null.\"],\"buyer_name\":[\"This field may not be null.\"]}}', '2025-09-17 11:05:53', '2025-09-17 11:30:32'),
(70, 11, 'efac322d-74c1-477e-a8b1-bab5dcee3571', 'App\\Models\\NomineeApplication', 60, NULL, '100000.00', 'TZS', 'initiation_failed', NULL, '255743331626', 'API call failed: {\"status\":\"error\",\"step\":\"order_creation\",\"message\":\"Validation failed\",\"errors\":{\"buyer_email\":[\"This field may not be null.\"],\"buyer_name\":[\"This field may not be null.\"]}}', '2025-09-17 11:10:18', '2025-09-17 11:30:34'),
(71, 11, 'fadae6f3-4c0a-4c16-a02d-dcae8bbd6b72', 'App\\Models\\NomineeApplication', 61, NULL, '100000.00', 'TZS', 'initiation_failed', NULL, '255743331626', 'API call failed: {\"status\":\"error\",\"step\":\"order_creation\",\"message\":\"Validation failed\",\"errors\":{\"buyer_email\":[\"This field may not be null.\"],\"buyer_name\":[\"This field may not be null.\"]}}', '2025-09-17 12:13:27', '2025-09-17 12:13:30'),
(72, 11, 'e2d5acd1-5e0b-4fc3-bd38-929b883b04d4', 'App\\Models\\NomineeApplication', 62, NULL, '100000.00', 'TZS', 'pending', NULL, '255743331626', 'Retry payment initiated by user.', '2025-09-17 14:42:19', '2025-09-18 00:01:32'),
(73, NULL, 'da5166b5-0654-4ddb-bc83-54fefdd888c2', 'App\\Models\\MarathonRegistration', 4, '0980894427', '200.00', 'TZS', 'completed', NULL, '255743331626', 'Webhook: Payment completed successfully.', '2025-09-17 19:07:35', '2025-09-17 19:08:00'),
(74, NULL, '1f65f1b8-548e-43f6-ada2-cf7b271623f3', 'App\\Models\\MarathonRegistration', 6, '0980927328', '200.00', 'TZS', 'completed', NULL, '255743331626', 'Webhook: Payment completed successfully.', '2025-09-18 00:24:09', '2025-09-18 00:24:31'),
(75, 11, '103636b5-a034-43b2-8205-9699a32fe7f1', 'App\\Models\\NomineeApplication', 63, NULL, '100000.00', 'TZS', 'pending', NULL, '255743331626', NULL, '2025-09-18 15:53:48', '2025-09-18 15:53:48'),
(76, 11, '4d6ebc2b-cacd-4099-a17f-697d36dca4f1', 'App\\Models\\NomineeApplication', 64, NULL, '100000.00', 'TZS', 'initiation_failed', NULL, '255611548626', 'API call failed: {\"status\":\"error\",\"step\":\"order_creation\",\"message\":\"Validation failed\",\"errors\":{\"buyer_email\":[\"Enter a valid email address.\"]}}', '2025-09-18 16:00:02', '2025-09-18 16:00:06'),
(77, 11, '31fe8e85-fa17-444f-b43e-ea71c71b95d7', 'App\\Models\\NomineeApplication', 65, NULL, '100000.00', 'TZS', 'pending', NULL, '255743331626', NULL, '2025-09-18 16:08:18', '2025-09-18 16:08:18'),
(78, 11, '67d76b59-9e71-4864-97d3-ad56752f1251', 'App\\Models\\NomineeApplication', 66, NULL, '100000.00', 'TZS', 'pending', NULL, '255787491555', NULL, '2025-09-18 16:11:26', '2025-09-18 16:11:26');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `is_admin`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'support@tapheawards.co.tz', 1, '2025-07-10 18:54:31', '$2y$12$d/.4Jy.stLx6vEvNMMWXjuCrfwW0aEWRqH9sA3zj27vF6c7DeJZsi', NULL, '2025-07-10 18:54:31', '2025-09-09 20:09:22'),
(2, 'Onesmo Alexander', 'onesmo@example.com', 0, NULL, '$2y$12$k5Wo2dh7ZhFMVV4pqY8kp.IsxUQUwC.h3gWkjeC2E63W5f/Q3fF2C', NULL, '2025-08-13 07:53:04', '2025-08-13 07:53:04'),
(3, 'Onesmo Alexander', 'onesmo2@example.com', 0, NULL, '$2y$12$U5P1966LwJCdEmQQGT7OtOzV5o7xOh59cdA9OmJoSTmhRzgL6dRUK', NULL, '2025-08-13 08:24:49', '2025-08-13 08:24:49'),
(4, 'Nemy Store', 'nemystore@gmail.com', 0, NULL, '$2y$12$PaM/juyriSbG3pkku7rtWuCSOotmadSlsiLcQ9CTSmMxBByCRQ0tC', NULL, '2025-08-14 05:24:22', '2025-08-14 05:24:22'),
(5, 'Niffer Store', 'niffer@gmail.com', 0, NULL, '$2y$12$H/9OZIWF545Iv2FirmPgc.8ClgFcP6pOY.hdX8BPMpqKCaICDAvS6', NULL, '2025-08-14 06:00:06', '2025-08-14 06:00:06'),
(6, 'abcde', 'abcde@gmail.com', 0, NULL, '$2y$12$iUjFazh4oggZ8vqpsjWZN.AABn/tHUynqMCE7RuZyyW5EjwcP934K', NULL, '2025-08-14 08:12:14', '2025-08-14 08:12:14'),
(7, 'test2', 'test2@gmail.com', 0, NULL, '$2y$12$xMLglrTYFONGjKIXmtSar.egWndlWJCMo597fPUTdErbjodNVcOpq', NULL, '2025-08-15 21:36:26', '2025-08-15 21:36:26'),
(8, 'jaribu', 'jarbu@example.com', 0, NULL, '$2y$12$/7m952jRerBGXOqIhQBrAeKVVboq6dr7OXlBWu6UMbzVh.DdEyLMe', NULL, '2025-08-16 06:46:16', '2025-08-16 06:46:16'),
(9, 'mimi', 'mimi@gmail.com', 0, NULL, '$2y$12$LJD77yOVev27pft47RNA6e/P11rym3jt4uz0UvJeAcBsUXSpByMjG', NULL, '2025-08-16 11:22:23', '2025-08-16 11:22:23'),
(10, 'Muta', 'muta@gmail.com', 0, NULL, '$2y$12$kSigXkYUxZ7P9Dyhpv5oZ.WP7nULm5B1BWvScCZ42VwisBhGj6.xW', NULL, '2025-08-26 18:24:37', '2025-08-26 18:24:37'),
(11, 'tibakya', 'onesmoalexander@gmail.com', 0, NULL, '$2y$12$e3DjHsC1BG3Fw.j662UP.uJ258g0sXT/Z3wpBwW0d4cizuus0LV/O', 'qcM8qVohVAW74nKtlu6DlQ3Vz6u0nEnyGQann3aNf9wqUFOSLGYJVse7MpJh', '2025-09-10 01:16:07', '2025-09-10 14:20:44');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nominee_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `fingerprint` varchar(255) DEFAULT NULL,
  `fingerprint_js` text DEFAULT NULL,
  `screen_resolution` varchar(255) DEFAULT NULL,
  `timezone` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `multi_factor_hash` varchar(255) DEFAULT NULL,
  `voted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `nominee_id`, `category_id`, `ip_address`, `user_agent`, `fingerprint`, `fingerprint_js`, `screen_resolution`, `timezone`, `language`, `multi_factor_hash`, `voted_at`, `created_at`, `updated_at`) VALUES
(2, 188, 117, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '4022e92bf9e0e55aad0162af963af52e6a152f27a17c73ba145e9afe27fd242d', '8d3d23aa683a6c018b87ea6ea92226fb', '1280x720', 'Africa/Dar_es_Salaam', 'en-US', 'a3ab373b4f31ceb67b9af74cdbd4a299bf4854f6e0100f45698ec924c8b12e2b', '2025-08-25 11:36:21', '2025-08-25 11:36:21', '2025-08-25 11:36:21'),
(3, 188, 117, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', 'e30b3ca3035d7a538da17f1b67051d88b8e892410dae932b1639a73b6055b813', '72eb87427bafe4a71b306aa43d4c53e0', '430x932', 'Africa/Dar_es_Salaam', 'en-US', '53f46a6ce97c894451d4242d0382b8281e3585e739d24f467701e90b24dc5733', '2025-08-26 11:05:48', '2025-08-26 11:05:48', '2025-08-26 11:05:48'),
(4, 188, 117, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', 'e30b3ca3035d7a538da17f1b67051d88b8e892410dae932b1639a73b6055b813', 'cf8161edf665228af80b6bfc22427d5c', '430x932', 'Africa/Dar_es_Salaam', 'en-US', '1d528b8f3b4760e9e5b029346e27c170cd27d05e7dbe91dae6561f7fa781aa99', '2025-08-26 11:06:45', '2025-08-26 11:06:45', '2025-08-26 11:06:45'),
(5, 189, 121, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '4022e92bf9e0e55aad0162af963af52e6a152f27a17c73ba145e9afe27fd242d', '8d3d23aa683a6c018b87ea6ea92226fb', '1280x720', 'Africa/Dar_es_Salaam', 'en-US', 'a3ab373b4f31ceb67b9af74cdbd4a299bf4854f6e0100f45698ec924c8b12e2b', '2025-08-26 14:56:56', '2025-08-26 14:56:56', '2025-08-26 14:56:56'),
(6, 190, 121, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '4022e92bf9e0e55aad0162af963af52e6a152f27a17c73ba145e9afe27fd242d', '1e1a307895f089912c204997d1abfe6d', '1280x720', 'Africa/Dar_es_Salaam', 'en-US', '9d9b6721efd644e10ec4c09f98fb6162511c5a3c36122d5b7872d0837300eb8c', '2025-08-26 17:15:00', '2025-08-26 17:15:00', '2025-08-26 17:15:00'),
(7, 189, 121, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '4022e92bf9e0e55aad0162af963af52e6a152f27a17c73ba145e9afe27fd242d', 'cbcb5e13e6a4471cb9084da2a4d3e367', '1280x720', 'Africa/Dar_es_Salaam', 'en-US', '38cb5c5c005e39fa3612bf5e808bf7bbf560ea1921eecb7b19b967b54b6bde1c', '2025-08-29 10:53:55', '2025-08-29 10:53:55', '2025-08-29 10:53:55');

-- --------------------------------------------------------

--
-- Table structure for table `winners`
--

CREATE TABLE `winners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nominee_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `year` year(4) NOT NULL,
  `position` int(11) NOT NULL DEFAULT 1,
  `award_ceremony_date` timestamp NULL DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`),
  ADD KEY `categories_parent_id_foreign` (`parent_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `gallery_albums`
--
ALTER TABLE `gallery_albums`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `gallery_albums_slug_unique` (`slug`);

--
-- Indexes for table `guest_invitations`
--
ALTER TABLE `guest_invitations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `guest_invitations_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `marathon_registrations`
--
ALTER TABLE `marathon_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `marathon_registrations_email_unique` (`email`),
  ADD UNIQUE KEY `marathon_registrations_unique_code_unique` (`unique_code`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nominees`
--
ALTER TABLE `nominees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nominees_category_id_foreign` (`category_id`);

--
-- Indexes for table `nominee_applications`
--
ALTER TABLE `nominee_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nominee_applications_user_id_foreign` (`user_id`),
  ADD KEY `nominee_applications_category_id_foreign` (`category_id`),
  ADD KEY `nominee_applications_reviewed_by_foreign` (`reviewed_by`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `posts_slug_unique` (`slug`),
  ADD KEY `posts_gallery_album_id_foreign` (`gallery_album_id`);

--
-- Indexes for table `reels`
--
ALTER TABLE `reels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `season_awards`
--
ALTER TABLE `season_awards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `season_awards_year_unique` (`year`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indexes for table `suggestions`
--
ALTER TABLE `suggestions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `suggestions_category_id_foreign` (`category_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactions_order_id_unique` (`order_id`),
  ADD KEY `transactions_user_id_foreign` (`user_id`),
  ADD KEY `transactions_payable_type_payable_id_index` (`payable_type`,`payable_id`),
  ADD KEY `transactions_gateway_reference_index` (`gateway_reference`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vote_category_hash_unique` (`category_id`,`multi_factor_hash`),
  ADD UNIQUE KEY `votes_category_id_fingerprint_js_unique` (`category_id`,`fingerprint_js`) USING HASH,
  ADD KEY `votes_fingerprint_index` (`fingerprint`),
  ADD KEY `votes_nominee_id_foreign` (`nominee_id`);

--
-- Indexes for table `winners`
--
ALTER TABLE `winners`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `winners_category_id_year_unique` (`category_id`,`year`),
  ADD KEY `winners_nominee_id_foreign` (`nominee_id`),
  ADD KEY `winners_category_id_foreign` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `gallery_albums`
--
ALTER TABLE `gallery_albums`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `guest_invitations`
--
ALTER TABLE `guest_invitations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `marathon_registrations`
--
ALTER TABLE `marathon_registrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `nominees`
--
ALTER TABLE `nominees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=196;

--
-- AUTO_INCREMENT for table `nominee_applications`
--
ALTER TABLE `nominee_applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `reels`
--
ALTER TABLE `reels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `season_awards`
--
ALTER TABLE `season_awards`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `suggestions`
--
ALTER TABLE `suggestions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `winners`
--
ALTER TABLE `winners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nominees`
--
ALTER TABLE `nominees`
  ADD CONSTRAINT `nominees_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nominee_applications`
--
ALTER TABLE `nominee_applications`
  ADD CONSTRAINT `nominee_applications_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `nominee_applications_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `nominee_applications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_gallery_album_id_foreign` FOREIGN KEY (`gallery_album_id`) REFERENCES `gallery_albums` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `suggestions`
--
ALTER TABLE `suggestions`
  ADD CONSTRAINT `suggestions_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `winners`
--
ALTER TABLE `winners`
  ADD CONSTRAINT `winners_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `winners_nominee_id_foreign` FOREIGN KEY (`nominee_id`) REFERENCES `nominees` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
