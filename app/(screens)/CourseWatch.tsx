interface Module {
  id: number;
  title: string;
  duration: string;
  isUnlocked: boolean;
  isActive?: boolean;
  videoUrl?: string;
}

const courseData = {
  title: "Islamic Finance Fundamentals",
  description: "Master the principles of Shariah-compliant investing through comprehensive lessons on Islamic finance, halal investments, and ethical trading practices.",
  duration: "4:30",
  modules: [
    {
      id: 1,
      title: "Introduction to Islamic Finance",
      duration: "15:30",
      isUnlocked: true,
      isActive: true,
      videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
    },
    // ... other modules remain same
  ] as Module[]
}; 