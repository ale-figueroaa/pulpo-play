const fs = require('fs');
const path = require('path');

const files = [
  'app/adult-dashboard.tsx',
  'app/(tabs)/SunkenShip.tsx',
  'app/(tabs)/SubmarineWorld.tsx',
  'app/(tabs)/streaks.tsx',
  'app/(tabs)/store.tsx',
  'app/(tabs)/profile.tsx',
  'app/(tabs)/homepage.tsx',
  'app/(tabs)/coralReef.tsx',
  'app/(auth)/signup.tsx',
  'app/(auth)/login.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove import
  content = content.replace(/import \* as ScreenOrientation from 'expo-screen-orientation';\r?\n?/g, '');

  // Remove useFocusEffect block
  const blockRegex = /^\s*useFocusEffect\(\s*useCallback\(\(\) => \{\s*if \(Platform\.OS !== 'web'\) \{\s*ScreenOrientation\.lockAsync\(ScreenOrientation\.OrientationLock\.(?:LANDSCAPE|PORTRAIT_UP)\);\s*\}\s*return \(\) => \{\s*if \(Platform\.OS !== 'web'\) \{\s*ScreenOrientation\.unlockAsync\(\);\s*\}\s*\};\s*\}, \[\]\)\s*\);\r?\n?/gm;
  
  content = content.replace(blockRegex, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
}
