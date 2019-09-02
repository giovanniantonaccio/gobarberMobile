import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { withNavigationFocus } from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Background from '../../components/Background';
import Appointment from '../../components/Appointment';

import { Container, Title, List } from './styles';

function Dashboard({ isFocused }) {
  const [appointments, setAppointments] = useState([]);

  async function loadAppointments() {
    const response = await api.get('appointments');

    setAppointments(response.data);
  }

  useEffect(() => {
    if (isFocused) {
      loadAppointments();
    }
  }, [isFocused]);

  async function handleCancel(id) {
    Alert.alert(
      'Excluir agendamento',
      'Realmente deseja excluir esse agendamento?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const response = await api.delete(`appointments/${id}`);

            setAppointments(
              appointments.map(appointment =>
                appointment.id === id
                  ? {
                      ...appointment,
                      canceled_at: response.data.canceled_at,
                    }
                  : appointment
              )
            );
          },
        },
      ]
    );
  }

  return (
    <Background>
      <Container>
        <Title>Agendamentos</Title>

        <List
          data={appointments}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Appointment onCancel={() => handleCancel(item.id)} data={item} />
          )}
        />
      </Container>
    </Background>
  );
}

const tabBarIcon = ({ tintColor }) => (
  <Icon name="event" size={20} color={tintColor} />
);

Dashboard.navigationOptions = {
  tabBarLabel: 'Agendamentos',
  tabBarIcon,
};

tabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Dashboard.propTypes = {
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Dashboard);
