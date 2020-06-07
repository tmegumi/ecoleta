import React, { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { Feather as Icon } from '@expo/vector-icons';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface SelectItem {
  label: string,
  value: string
}

const Home = () => {
  const [ufSelectItems, setUfSelectItems] = useState<SelectItem[]>([]);
  const [citySelectItems, seCitySelectItems] = useState<SelectItem[]>([]);

  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(reponse => {
        const ufItems = reponse.data.map(uf => ({
          label: uf.sigla, 
          value: uf.sigla
        }));

        setUfSelectItems(ufItems);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityItems = response.data.map(city => ({
          label: city.nome,
          value: city.nome
        }));

        seCitySelectItems(cityItems);
      });
  }, [selectedUf]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      city: selectedCity,
      uf: selectedUf
    });
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 247, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect 
            style={pickerSelectStyles}
            items={ufSelectItems}
            onValueChange={(uf) => setSelectedUf(uf)}
            placeholder={{
              label: 'Selecione uma UF...'
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <Icon 
                name="chevron-down" 
                color="#A0A0B2" 
                size={24} 
                style={styles.selectIcon}
              />
            )}
          />
          <RNPickerSelect 
            style={pickerSelectStyles}
            items={citySelectItems}
            onValueChange={(city) => setSelectedCity(city)}
            placeholder={{
              label: 'Selecione uma cidade...'
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <Icon 
                name="chevron-down" 
                color="#A0A0B2" 
                size={24} 
                style={styles.selectIcon}
              />
            )}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  selectIcon: {
    padding: 18,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    paddingVertical: 0,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    paddingVertical: 0,
    fontSize: 16,
  },
});

export default Home;