import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { DonationCategory } from '../types';
import { useI18n } from '../i18n';
import { getDonationLink } from '../utils/punishment';

interface Props {
  category: DonationCategory;
  amount: number;
  onDonated?: () => void;
}

export function DonationLinkCard({ category, amount, onDonated }: Props) {
  const { t, locale } = useI18n();
  const donationInfo = getDonationLink(category);

  const handleOpenLink = async () => {
    if (donationInfo?.url) {
      try {
        await Linking.openURL(donationInfo.url);
      } catch (error) {
        console.error('Failed to open donation link:', error);
      }
    }
  };

  if (!donationInfo) return null;

  const name = locale === 'ja' ? donationInfo.nameJa : donationInfo.name;
  const description = locale === 'ja' ? donationInfo.descriptionJa : donationInfo.description;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.punishment.donationRequired}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.orgName}>{name}</Text>
        <Text style={styles.orgDesc}>{description}</Text>
        <Text style={styles.amount}>¥{amount.toLocaleString()}</Text>
      </View>

      <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
        <Text style={styles.linkButtonText}>{t.punishment.openDonationSite}</Text>
      </TouchableOpacity>

      {onDonated && (
        <TouchableOpacity style={styles.doneButton} onPress={onDonated}>
          <Text style={styles.doneButtonText}>{t.punishment.donationComplete}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  orgName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  orgDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  linkButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  doneButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    color: '#666',
  },
});
