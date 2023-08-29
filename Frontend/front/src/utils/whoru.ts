const whoru = (uid: number): string | undefined => {
  const firstNum = uid.toString().substring(0, 1);
  if (firstNum === '2') return 'student';
  else if (firstNum === '4') return 'teacher';
  else if (firstNum === '5') return 'admin';
};

export default whoru;
