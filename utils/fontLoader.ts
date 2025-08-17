import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'Inter-Bold': require('@expo-google-fonts/inter/Inter_700Bold.ttf'),
    'Inter-Regular': require('@expo-google-fonts/inter/Inter_400Regular.ttf'),
    'Inter-Medium': require('@expo-google-fonts/inter/Inter_500Medium.ttf'),
    'Inter-SemiBold': require('@expo-google-fonts/inter/Inter_600SemiBold.ttf'),

    'Poppins-Bold': require('@expo-google-fonts/poppins/Poppins_700Bold.ttf'),
    'Poppins-Regular': require('@expo-google-fonts/poppins/Poppins_400Regular.ttf'),
    'Poppins-Medium': require('@expo-google-fonts/poppins/Poppins_500Medium.ttf'),
    'Poppins-SemiBold': require('@expo-google-fonts/poppins/Poppins_600SemiBold.ttf'),

    'Montserrat-Bold': require('@expo-google-fonts/montserrat/Montserrat_700Bold.ttf'),
    'Montserrat-Regular': require('@expo-google-fonts/montserrat/Montserrat_400Regular.ttf'),
    'Montserrat-Medium': require('@expo-google-fonts/montserrat/Montserrat_500Medium.ttf'),
    'Montserrat-SemiBold': require('@expo-google-fonts/montserrat/Montserrat_600SemiBold.ttf'),

    'BebasNeue-Regular': require('@expo-google-fonts/bebas-neue/BebasNeue_400Regular.ttf'),

    'Oswald-Bold': require('@expo-google-fonts/oswald/Oswald_700Bold.ttf'),
    'Oswald-Regular': require('@expo-google-fonts/oswald/Oswald_400Regular.ttf'),
    'Oswald-Medium': require('@expo-google-fonts/oswald/Oswald_500Medium.ttf'),
  });
};
