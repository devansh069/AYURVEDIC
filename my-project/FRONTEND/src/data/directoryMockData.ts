export interface DirectoryDoctor {
  id: string;
  name: string;
  photo: string;
  qualification: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  city: string;
  clinicName: string;
  consultationFee: number;
  onlineConsultationFee: number;
  languages: string[];
  availability: string;
  successRate: number;
  patientsTreated: number;
  verified: boolean;
  bio: string;
}

export const MOCK_DIRECTORY_DOCTORS: DirectoryDoctor[] = [
  {
    "id": "doc-dir-1",
    "name": "Dr. Aditya Vardhan Sharma",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Panchakarma)",
    "specialization": "Panchakarma Specialist",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 124,
    "city": "Jaipur",
    "clinicName": "Shri Dhanwantari Panchakarma & Wellness Center",
    "consultationFee": 800,
    "onlineConsultationFee": 600,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Rajasthani"
    ],
    "availability": "Mon - Sat (9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Aditya Vardhan Sharma is a distinguished Panchakarma expert with over 18 years of clinical practice focusing on chronic metabolic and musculoskeletal disorders. He utilizes a meticulous Nadi Pariksha diagnostic approach to customize intensive detoxification therapies like Virechana and Basti for his patients. His practice integrates classical Shirodhara techniques with evidence-based herbal protocols to ensure holistic restoration of the Tridosha balance."
  },
  {
    "id": "doc-dir-2",
    "name": "Dr. Aniruddh Deshpande",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Kayachikitsa (General Medicine)",
    "experience": 18,
    "rating": 4.7,
    "reviewCount": 142,
    "city": "Mumbai",
    "clinicName": "Kottakkal Arya Vaidya Sala Agency - Mumbai Branch",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Marathi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Aniruddh Deshpande is a seasoned clinician specializing in internal medicine with over 18 years of experience in managing chronic lifestyle disorders. He integrates classical Nadi Pariksha with modern diagnostic tools to create comprehensive healing protocols for metabolic and respiratory ailments. His practice focuses on root-cause elimination through personalized Panchakarma therapies such as Basti and Shirodhara alongside authentic herbal formulations."
  },
  {
    "id": "doc-dir-3",
    "name": "Dr. Ashutosh Bhardwaj",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Shalya Tantra)",
    "specialization": "Shalya Tantra (Ayurvedic Surgery & Marma)",
    "experience": 18,
    "rating": 4.9,
    "reviewCount": 142,
    "city": "Delhi",
    "clinicName": "Dhanwantari Shalya Chikitsalaya & Marma Center",
    "consultationFee": 1000,
    "onlineConsultationFee": 800,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Punjabi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 94,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "A seasoned practitioner specializing in para-surgical procedures like Kshara Sutra therapy for anorectal disorders and Marma Chikitsa for musculoskeletal issues. He integrates ancient Shalya Tantra principles with modern diagnostic methods to provide minimally invasive and holistic surgical care. His practice is renowned in Delhi for successfully treating complex cases of fistula-in-ano and chronic sports injuries using traditional Ayurvedic techniques."
  },
  {
    "id": "doc-dir-4",
    "name": "Dr. Lakshmi S. Nair",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Prasuti Tantra & Stri Roga)",
    "specialization": "Prasuti Tantra & Stri Roga (Gynaecology)",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Kochi",
    "clinicName": "Kottakkal Arya Vaidya Sala Agency, Kochi Center",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Malayalam",
      "Hindi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (9:30 AM - 1:30 PM, 4:30 PM - 7:30 PM)",
    "successRate": 91,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Lakshmi Nair is a distinguished specialist with over 18 years of experience in female reproductive health, focusing on root-cause diagnosis through Prakriti analysis. She is renowned for her expertise in managing infertility and hormonal imbalances using specialized Uttara Basti and tailor-made herbal protocols. Her clinical approach integrates traditional Ayurvedic wisdom with personalized lifestyle modifications to ensure long-term wellness for women."
  },
  {
    "id": "doc-dir-5",
    "name": "Dr. Raghavendra Hegde",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Diabetes & Metabolic Disorders",
    "experience": 18,
    "rating": 4.9,
    "reviewCount": 142,
    "city": "Bangalore",
    "clinicName": "Indus Valley Ayurvedic Centre, Indiranagar",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Kannada"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Raghavendra Hegde specializes in managing Type 2 diabetes and metabolic syndrome through a blend of traditional Nadi Pariksha and evidence-based clinical protocols. His approach integrates customized Panchakarma therapies like Virechana and Takradhara with proprietary herbal formulations to improve insulin sensitivity and metabolic health. He focuses on long-term lifestyle modification and root-cause reversal of metabolic imbalances to ensure sustainable patient wellness."
  },
  {
    "id": "doc-dir-6",
    "name": "Dr. Vinay Deshpande",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Arthritis & Spine Specialist",
    "experience": 18,
    "rating": 4.7,
    "reviewCount": 142,
    "city": "Pune",
    "clinicName": "Sanjeevani Ayurvedic Spine & Joint Clinic",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Vinay Deshpande is a dedicated specialist with over 18 years of clinical expertise in treating complex spinal conditions and chronic arthritic disorders. He utilizes a precision-based approach combining Nadi Pariksha (Pulse Diagnosis) with specialized Shodhana and Shamana therapies to restore joint mobility and alleviate pain. His clinical practice is renowned for successful non-surgical interventions using Kati Basti, Greva Basti, and customized herbal decoctions."
  },
  {
    "id": "doc-dir-7",
    "name": "Dr. Arvind Nautiyal",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Skin & Hair Disorders (Kitibha)",
    "experience": 18,
    "rating": 4.7,
    "reviewCount": 134,
    "city": "Dehradun",
    "clinicName": "Shivalik Ayurvedic Skin & Wellness Center",
    "consultationFee": 600,
    "onlineConsultationFee": 500,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Garhwali"
    ],
    "availability": "Mon - Sat (10:00 AM - 2:00 PM, 5:00 PM - 8:00 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Nautiyal has over 18 years of clinical experience in treating chronic skin conditions like Psoriasis (Kitibha) and Eczema through traditional Ayurvedic principles. He utilizes Nadi Pariksha to identify underlying Dosha imbalances and focuses on Rakta Shodhana (blood purification) through customized Panchakarma therapies. His treatment plans integrate Shodhana (detox) and Shamana (palliative herbs) along with strict dietary guidelines for long-term skin health."
  },
  {
    "id": "doc-dir-8",
    "name": "Dr. K. Ananthakrishnan",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Manasa Roga)",
    "specialization": "Mental Wellness & Nootropic Therapies",
    "experience": 18,
    "rating": 4.9,
    "reviewCount": 142,
    "city": "Chennai",
    "clinicName": "Sree Shankara Ayurveda Nilayam",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Tamil",
      "Hindi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Ananthakrishnan is a distinguished specialist in Manasa Roga with nearly two decades of clinical experience in treating cognitive decline and anxiety disorders. His diagnostic approach integrates classical Nadi Pariksha with modern psychological assessments to create personalized Medhya Rasayana (nootropic) protocols. He specializes in therapeutic interventions such as Shirodhara, Nasya, and customized herbal formulations to enhance mental clarity and emotional balance."
  },
  {
    "id": "doc-dir-9",
    "name": "Dr. Aditya Pratap Singh",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Panchakarma)",
    "specialization": "Panchakarma Specialist",
    "experience": 18,
    "rating": 4.7,
    "reviewCount": 142,
    "city": "Jaipur",
    "clinicName": "Dhanwantari Ayurveda & Panchakarma Center",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Rajasthani"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Singh is a seasoned practitioner with over 18 years of clinical expertise in classical Panchakarma therapies and metabolic rejuvenation. He employs precise Nadi Pariksha for root-cause diagnosis, specializing in Vamana and Virechana procedures to treat chronic lifestyle disorders. His approach integrates authentic Shirodhara and Basti treatments with personalized herbal protocols for holistic wellness."
  },
  {
    "id": "doc-dir-10",
    "name": "Dr. Sandeep Kulkarni",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Kayachikitsa (General Medicine)",
    "experience": 19,
    "rating": 4.9,
    "reviewCount": 156,
    "city": "Mumbai",
    "clinicName": "Shree Dhanwantari Ayurvedic Clinic & Research Centre",
    "consultationFee": 1200,
    "onlineConsultationFee": 900,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Marathi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2280,
    "verified": true,
    "bio": "Dr. Sandeep Kulkarni is a seasoned Kayachikitsa specialist with nearly two decades of experience in managing chronic lifestyle disorders through traditional Shodhana and Shamana therapies. He integrates classical Nadi Pariksha with modern diagnostic insights to provide personalized treatment protocols for metabolic and autoimmune conditions. His expertise lies in Agni management and the administration of specialized Rasayana procedures to restore systemic balance."
  },
  {
    "id": "doc-dir-11",
    "name": "Dr. Vikramaditya Singh",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Shalya Tantra)",
    "specialization": "Shalya Tantra (Ayurvedic Surgery & Marma)",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Delhi",
    "clinicName": "Dhanwantari Shalya & Marma Chikitsa Kendra",
    "consultationFee": 1200,
    "onlineConsultationFee": 900,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Punjabi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 94,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Vikramaditya Singh is a seasoned Shalya Tantra expert with nearly two decades of experience specializing in para-surgical procedures like Kshara Sutra and Agnikarma. He employs a rigorous diagnostic approach, integrating Marma Chikitsa with specialized herbal protocols to manage complex anorectal disorders and chronic pain. His practice is dedicated to providing minimally invasive Ayurvedic surgical solutions that focus on rapid recovery and long-term wellness."
  },
  {
    "id": "doc-dir-12",
    "name": "Dr. Radhika Nair",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Prasuti Tantra & Stri Roga)",
    "specialization": "Prasuti Tantra & Stri Roga (Gynaecology)",
    "experience": 14,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Kochi",
    "clinicName": "Kottakkal Arya Vaidya Sala Agency & Ayurvedic Clinic, Kochi",
    "consultationFee": 600,
    "onlineConsultationFee": 500,
    "languages": [
      "English",
      "Malayalam",
      "Sanskrit",
      "Hindi"
    ],
    "availability": "Mon - Sat (9:30 AM - 1:30 PM, 4:30 PM - 7:30 PM)",
    "successRate": 91,
    "patientsTreated": 1680,
    "verified": true,
    "bio": "Dr. Radhika Nair is a highly accomplished Ayurvedic gynaecologist with over 14 years of dedicated experience in managing complex female reproductive disorders. She utilizes classical Ashtasthana Pariksha (eight-fold diagnosis) and Nadi Pariksha to identify underlying dosha imbalances before creating personalized treatment regimes. Her clinical expertise lies in administering specialized therapies like Uttar Basti and Yoniprakshalana, alongside traditional herbal formulations, for successfully managing PCOD, uterine fibroids, and female infertility."
  },
  {
    "id": "doc-dir-13",
    "name": "Dr. K. S. Venkatesh Murthy",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Diabetes & Metabolic Disorders",
    "experience": 22,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Bangalore",
    "clinicName": "Sri Sri Tattva Panchakarma Center, Bangalore",
    "consultationFee": 850,
    "onlineConsultationFee": 700,
    "languages": [
      "English",
      "Hindi",
      "Kannada",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (9:00 AM - 1:00 PM, 4:00 PM - 7:30 PM)",
    "successRate": 91,
    "patientsTreated": 2640,
    "verified": true,
    "bio": "With over two decades of clinical practice, Dr. Murthy specializes in managing type 2 diabetes and metabolic syndrome through personalized Kayachikitsa protocols. He utilizes Nadi Pariksha for deep diagnostic insights, focusing on correcting the root cause of metabolic imbalances rather than just suppressing symptoms. His treatment plans integrate traditional Shodhana therapies like Virechana with specialized herbal formulations to naturally improve glucose metabolism and prevent diabetic complications."
  },
  {
    "id": "doc-dir-14",
    "name": "Dr. Aniket Deshpande",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Arthritis & Spine Specialist",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Pune",
    "clinicName": "Sanjeevani Ayurvedic Spine & Joint Center",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (9:30 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Deshpande is a renowned specialist with over 18 years of experience in managing chronic musculoskeletal disorders through traditional Ayurvedic protocols. He employs a rigorous Nadi Pariksha diagnostic approach to create personalized treatment plans focused on avoiding surgery for complex spinal conditions. His practice integrates specialized Panchakarma therapies like Kati Basti and Griva Basti with potent herbal formulations to ensure long-term joint health and mobility."
  },
  {
    "id": "doc-dir-15",
    "name": "Dr. Anand Vardhan Nautiyal",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Skin & Hair Disorders (Kitibha)",
    "experience": 18,
    "rating": 4.7,
    "reviewCount": 134,
    "city": "Dehradun",
    "clinicName": "Himalayan Vedic Healing Center, Dehradun",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Garhwali"
    ],
    "availability": "Mon - Sat (10:00 AM - 2:00 PM, 5:00 PM - 8:00 PM)",
    "successRate": 91,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Anand Vardhan Nautiyal is a seasoned clinician with nearly two decades of experience in managing chronic skin disorders and hair loss through classical Ayurvedic principles. His diagnostic process focuses on Nadi Pariksha and Doshic imbalance analysis to treat conditions like Kitibha (Psoriasis) and scalp infections from the root. He is renowned for his mastery in Shodhana therapies, particularly Takradhara and Vamana, paired with bespoke herbal protocols for lasting recovery."
  },
  {
    "id": "doc-dir-16",
    "name": "Dr. Vikram Krishnan",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Manasa Roga)",
    "specialization": "Mental Wellness & Nootropic Therapies",
    "experience": 16,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Chennai",
    "clinicName": "Arya Vaidya Pharmacy (AVP) Clinic, Mylapore",
    "consultationFee": 800,
    "onlineConsultationFee": 700,
    "languages": [
      "English",
      "Tamil",
      "Sanskrit",
      "Hindi"
    ],
    "availability": "Mon - Sat (9:30 AM - 1:30 PM, 4:30 PM - 7:30 PM)",
    "successRate": 91,
    "patientsTreated": 1920,
    "verified": true,
    "bio": "Dr. Vikram Krishnan is a highly regarded Ayurvedic physician with over 16 years of expertise in treating anxiety, sleep disorders, and cognitive decline. He utilizes traditional Nadi Pariksha (pulse diagnosis) along with modern clinical assessments to understand each patient's unique mind-body constitution. His customized treatment protocols leverage Medhya Rasayanas (nootropic herbs) combined with Panchakarma therapies like Shirodhara and Nasya to restore mental equilibrium and cognitive vitality."
  },
  {
    "id": "doc-dir-17",
    "name": "Dr. Devendra Prasad Sharma",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Panchakarma)",
    "specialization": "Panchakarma Specialist",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Jaipur",
    "clinicName": "Shree Radhey Ayurvedic Panchakarma Kendra",
    "consultationFee": 600,
    "onlineConsultationFee": 500,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Rajasthani"
    ],
    "availability": "Mon - Sat (9:00 AM - 1:00 PM, 4:00 PM - 8:00 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "With over 18 years of clinical practice, Dr. Devendra Prasad Sharma is dedicated to restoring systemic balance through customized Panchakarma therapies. He utilizes traditional Nadi Pariksha (pulse diagnosis) to identify root constitutional imbalances and design personalized detoxification regimens. His clinical expertise lies in successfully managing chronic musculoskeletal disorders, stress-induced ailments, and digestive issues using therapies like Basti, Shirodhara, and classical herbal formulations."
  },
  {
    "id": "doc-dir-18",
    "name": "Dr. Sanjay Deshmukh",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Kayachikitsa (General Medicine)",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Mumbai",
    "clinicName": "Dhanvantari Holistic Healing Center",
    "consultationFee": 1200,
    "onlineConsultationFee": 1000,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Marathi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "Dr. Sanjay Deshmukh is a seasoned Kayachikitsa specialist with nearly two decades of experience in treating chronic metabolic and digestive disorders through classical Ayurvedic protocols. He combines Nadi Pariksha with evidence-based research to design personalized treatment plans involving Deepana, Pachana, and targeted Panchakarma therapies. His clinical focus remains on reversing lifestyle diseases using pure herbal formulations and rigorous lifestyle modifications."
  },
  {
    "id": "doc-dir-19",
    "name": "Dr. Devendra Kumar Mishra",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Shalya Tantra)",
    "specialization": "Shalya Tantra (Ayurvedic Surgery & Marma)",
    "experience": 16,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Delhi",
    "clinicName": "Dhanvantari Shalya Chikitsalaya & Marma Care",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Punjabi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 1920,
    "verified": true,
    "bio": "With over 16 years of clinical excellence, Dr. Devendra Mishra specializes in Shalya Tantra with a focus on minimally invasive Ayurvedic surgical techniques and Marma Chikitsa. His diagnostic approach integrates traditional Nadi Pariksha with modern radiological assessments to determine the most effective path of healing. He is widely recognized for his high success rates in managing complex ano-rectal disorders using Kshara Sutra and relieving chronic pain through Agnikarma and Raktamokshana."
  },
  {
    "id": "doc-dir-20",
    "name": "Dr. Meera Nair",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Prasuti Tantra & Stri Roga)",
    "specialization": "Prasuti Tantra & Stri Roga (Gynaecology)",
    "experience": 16,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Kochi",
    "clinicName": "Kottakkal Arya Vaidya Sala, Ernakulam Kochi",
    "consultationFee": 500,
    "onlineConsultationFee": 400,
    "languages": [
      "English",
      "Malayalam",
      "Hindi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (9:30 AM - 1:30 PM, 4:30 PM - 7:30 PM)",
    "successRate": 92,
    "patientsTreated": 1920,
    "verified": true,
    "bio": "With over 16 years of dedicated clinical practice, Dr. Meera Nair is a highly respected specialist in Prasuti Tantra & Stri Roga (Ayurvedic Gynaecology and Obstetrics) in Kochi. She employs deep-rooted Ayurvedic diagnostic methods like Nadi Pariksha and Ashtasthana Pariksha to identify root causes of hormonal imbalances and reproductive disorders. Her expertise lies in administering specialized therapies such as Uttara Basti, Yonidhavana, and customized herbal formulations for treating PCOS, infertility, and menopausal issues."
  },
  {
    "id": "doc-dir-21",
    "name": "Dr. Raghavendra Bhat",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Diabetes & Metabolic Disorders",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 124,
    "city": "Bangalore",
    "clinicName": "Kottakkal Arya Vaidya Sala, Indiranagar Clinic",
    "consultationFee": 600,
    "onlineConsultationFee": 500,
    "languages": [
      "English",
      "Kannada",
      "Hindi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:00 PM)",
    "successRate": 91,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "With over 18 years of clinical expertise, Dr. Raghavendra Bhat specializes in the holistic management of Type-2 Diabetes (Prameha) and metabolic disorders through evidence-based Ayurveda. He employs precise Nadi Pariksha (pulse diagnosis) to understand constitutional imbalances and designs customized root-cause treatment protocols. His therapies integrate specialized Panchakarma detoxifications like Virechana, tailored dietary regimens, and classical herbal formulations to restore metabolic harmony."
  },
  {
    "id": "doc-dir-22",
    "name": "Dr. Ananth Deshpande",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Arthritis & Spine Specialist",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Pune",
    "clinicName": "Kerala Ayurveda Vaidyashala, Deccan Gymkhana Branch",
    "consultationFee": 800,
    "onlineConsultationFee": 600,
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 91,
    "patientsTreated": 2160,
    "verified": true,
    "bio": "With over 18 years of clinical expertise, Dr. Ananth Deshpande specializes in managing chronic musculoskeletal and spinal disorders through traditional Ayurvedic protocols. He utilizes precise Nadi Pariksha (pulse diagnosis) to tailor personalized Shodhana (detoxification) and Shamana (palliative) therapies. His integrative approach combines specialized Panchakarma therapies like Janu Basti and Greeva Basti with targeted herbal formulations to restore joint mobility and spinal health."
  },
  {
    "id": "doc-dir-23",
    "name": "Dr. Harish Chandra Nautiyal",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Skin & Hair Disorders (Kitibha)",
    "experience": 16,
    "rating": 4.7,
    "reviewCount": 112,
    "city": "Dehradun",
    "clinicName": "Devbhoomi Ayurvedic Skin & Panchakarma Kendra",
    "consultationFee": 600,
    "onlineConsultationFee": 500,
    "languages": [
      "Hindi",
      "English",
      "Sanskrit",
      "Garhwali"
    ],
    "availability": "Mon - Sat (10:00 AM - 2:00 PM, 5:00 PM - 8:00 PM)",
    "successRate": 91,
    "patientsTreated": 1920,
    "verified": true,
    "bio": "With over 16 years of dedicated clinical practice, Dr. Nautiyal specializes in managing chronic skin and hair disorders like Kitibha (Psoriasis) through classical Ayurvedic protocols. His diagnostic approach integrates traditional Nadi Pariksha (Pulse Diagnosis) with modern clinical evaluation to pinpoint deep-seated dosha imbalances. He designs personalized treatment regimens combining intensive Panchakarma therapies like Raktamokshana and Takradhara alongside customized herbo-mineral formulations."
  },
  {
    "id": "doc-dir-24",
    "name": "Dr. Madhavan Krishnan",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Manasa Roga)",
    "specialization": "Mental Wellness & Nootropic Therapies",
    "experience": 16,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Chennai",
    "clinicName": "Arya Vaidya Pharmacy (AVP) Clinic, Mylapore",
    "consultationFee": 800,
    "onlineConsultationFee": 700,
    "languages": [
      "English",
      "Tamil",
      "Sanskrit",
      "Malayalam"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 91,
    "patientsTreated": 1920,
    "verified": true,
    "bio": "With over 16 years of clinical excellence, Dr. Madhavan specializes in treating stress, anxiety, and cognitive decline using authentic Ayurvedic methodologies. His diagnostic approach deeply integrates Nadi Pariksha (pulse diagnosis) with modern psychological assessments to understand each patient's unique mind-body constitution. He designs highly personalized recovery pathways featuring Shirodhara, Nasya, and proprietary Medhya Rasayana formulations to restore emotional and neurological balance."
  }
];;

export const MOCK_REVIEWS_DIRECTORY = [
  { id: "r1", patientName: "Ananya Mehta", rating: 5, comment: "Dr. Amit Patel's Panchakarma treatment completely cured my long-standing lower back pain. Truly life-changing!", date: "2026-05-14", specialty: "Panchakarma" },
  { id: "r2", patientName: "Rahul Sharma", rating: 5, comment: "I had severe psoriasis. Dr. Sunita Rao's herbs and blood purifier syrup gave me visible relief in just 4 weeks.", date: "2026-05-20", specialty: "Skin Disorders" },
  { id: "r3", patientName: "Sneha Reddy", rating: 4, comment: "Highly recommend Dr. Meera Nair for PCOS. She explained my condition and laid down a very simple lifestyle path.", date: "2026-06-01", specialty: "PCOS Care" },
  { id: "r4", patientName: "Amit Joshi", rating: 5, comment: "I had chronic acidity and hyper-acidity for 5 years. Dr. Rajesh Khanna's remedies completely reversed my issues.", date: "2026-06-08", specialty: "Digestive Disorders" }
];

export const TOP_SPECIALIZATIONS = [
  { name: "Panchakarma", count: 180, icon: "🌿", description: "Detoxification & Rejuvenation" },
  { name: "Skin Care", count: 140, icon: "✨", description: "Psoriasis, Acne & Eczema Care" },
  { name: "PCOS", count: 110, icon: "🌸", description: "Hormonal & Cycle Balancers" },
  { name: "Diabetes", count: 150, icon: "🩺", description: "Metabolic Fire & Sugar Reversal" },
  { name: "Digestive Disorders", count: 190, icon: "🥣", description: "Agni Balance, IBS & Gastritis" },
  { name: "Stress Management", count: 120, icon: "🧘", description: "Shirodhara & Vata Soothers" },
  { name: "Weight Management", count: 130, icon: "⚖️", description: "Meda Scraping & Metabolic Accel" },
  { name: "Arthritis", count: 160, icon: "🦴", description: "Joint Lubrication & Spine Care" },
  { name: "Hair Care", count: 95, icon: "💇", description: "Scalp Health & Hair Fall Reversals" },
  { name: "Infertility", count: 105, icon: "👶", description: "Uttarbasti & Sperm Rejuvenation" }
];

export const TOP_CITIES = [
  { name: "Delhi", count: 245, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=200&q=80" },
  { name: "Mumbai", count: 210, image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=200&q=80" },
  { name: "Bangalore", count: 185, image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=200&q=80" },
  { name: "Hyderabad", count: 130, image: "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=200&q=80" },
  { name: "Pune", count: 95, image: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=200&q=80" },
  { name: "Jaipur", count: 115, image: "https://images.unsplash.com/photo-1477584305590-38772bf2548f?auto=format&fit=crop&w=200&q=80" },
  { name: "Ahmedabad", count: 88, image: "https://images.unsplash.com/photo-1600664901390-3413f241f57f?auto=format&fit=crop&w=200&q=80" },
  { name: "Chandigarh", count: 72, image: "https://images.unsplash.com/photo-1616781296184-e4df0c061596?auto=format&fit=crop&w=200&q=80" }
];

export const FAQS = [
  {
    question: "What qualifications should I look for in an Ayurvedic doctor?",
    answer: "A qualified Ayurvedic doctor typically holds a BAMS (Bachelor of Ayurvedic Medicine and Surgery) degree from a recognized university. MD or MS (Ayurveda) represents post-graduate specialization in fields like Panchakarma, Kaya Chikitsa (internal medicine), or Shalya Tantra (surgery/orthopedics)."
  },
  {
    question: "What is Panchakarma and how does it help?",
    answer: "Panchakarma is the signature five-fold detoxification and purification therapy in Ayurveda. It includes Vamana (emesis), Virechana (purgation), Basti (medicated enema), Nasya (nasal administration), and Raktamokshana (bloodletting). It removes deep-seated toxins (Ama) and restores dosha balance."
  },
  {
    question: "Can Ayurvedic doctors consult online?",
    answer: "Yes, many Ayurvedic doctors offer highly effective video consultations for lifestyle coaching, diet analysis, and chronic illness management. Pulse diagnosis (Nadi Pariksha) is typically done in-person, but symptoms, tongue examination, and detailed history checks work perfectly online."
  },
  {
    question: "Is Ayurveda safe to combine with Allopathy?",
    answer: "Ayurveda can generally be combined with Allopathic treatments as complementary care. However, it is essential to inform your Ayurvedic Vaidya and your Allopathic physician about all formulations and drugs you are taking to prevent potential herb-drug interactions."
  },
  {
    question: "How long does it take to see results with Ayurvedic treatments?",
    answer: "Ayurveda targets the root cause of an imbalance rather than suppressing symptoms, which means chronic conditions may take 2 weeks to 3 months to show sustained, structural improvements. Acute conditions (like digestive upsets or minor sleep issues) can respond much faster."
  }
];
