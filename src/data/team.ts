import ali from '../assets/images/ali-hassan-prosthetist-orthotist.jpg';
import khurram from '../assets/images/khurram-niazi-prosthetist-orthotist.jpg';

export const team = [
  {
    id: 'ali-hassan',
    name: 'Ali Hassan',
    role: 'Prosthetist & Orthotist',
    badge: 'ISPO Certified',
    image: ali,
    alt: 'Ali Hassan, ISPO certified prosthetist and orthotist at AIM Rehab, in a white coat',
    bio: [
      "Ali is a prosthetist and orthotist with more than three years of clinical work. Getting a socket shape just right is the technical side of the job, but for Ali the real test is how the patient feels when they walk out of the door.",
      "Ali's work covers prosthetic sockets, newer prosthetic parts, gait analysis (studying the way a person walks) and CAD/CAM, which means designing and shaping devices on a computer. Ali also designs custom orthoses for people who need support at the ankle, knee or spine.",
    ],
    creds: [
      { icon: 'grad', title: 'BS Prosthetics & Orthotics Sciences', text: 'Degree in the design, making and fitting of artificial limbs and braces.' },
      { icon: 'award', title: 'ISPO Certified', text: 'ISPO is the International Society for Prosthetics and Orthotics, a global body for this field.' },
      { icon: 'clock', title: '3+ years of clinical experience', text: 'Hands-on work with adults and children in rehab settings.' },
    ],
    focus: ['Prosthetic sockets', 'Gait analysis', 'CAD/CAM design', 'Custom orthoses', 'Patient-focused rehab'],
  },
  {
    id: 'khurram-niazi',
    name: 'Khurram Niazi',
    role: 'Prosthetist & Orthotist',
    badge: 'ISPO Certified',
    image: khurram,
    alt: 'Khurram Niazi, ISPO certified prosthetist and orthotist at AIM Rehab, in a white coat',
    bio: [
      "Khurram looks after patients from the very first check to long-term care. Khurram takes time at the start, because a careful assessment usually means fewer problems later.",
      "Khurram's work covers patient assessment, custom prosthetic and orthotic design, casting, fittings and gait training (helping people learn to walk well with a new device). It also includes CAD/CAM design and staying in touch with patients over the long term as their needs change.",
    ],
    creds: [
      { icon: 'grad', title: 'Bachelors in Prosthetics & Orthotics Sciences', text: 'Pakistan Institute of Prosthetic & Orthotic Sciences, affiliated with Khyber Medical University, Peshawar.' },
      { icon: 'award', title: 'ISPO Certified', text: 'ISPO is the International Society for Prosthetics and Orthotics, a global body for this field.' },
      { icon: 'users', title: 'Long-term patient care', text: 'Follows patients through fitting, training and later device changes.' },
    ],
    focus: ['Patient assessment', 'Casting and fitting', 'Gait training', 'CAD/CAM design', 'Long-term follow-up'],
  },
];
