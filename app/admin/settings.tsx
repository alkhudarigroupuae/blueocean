import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Alert, LayoutAnimation, Platform, UIManager, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AdminSettings() {
  const router = useRouter();
  const { apiSettings, updateApiSettings } = useStore();
  
  const [markup, setMarkup] = useState(apiSettings.markupPercentage.toString());
  const [providers, setProviders] = useState(apiSettings.providers);
  const [expandedProvider, setExpandedProvider] = useState<string | null>('Booking.com');
  const [branding, setBranding] = useState(apiSettings.branding);
  
  // Payment Gateway States
  const [paymentSettings, setPaymentSettings] = useState(apiSettings.paymentGateways);

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [certAlias, setCertAlias] = useState('');
  const [certContent, setCertContent] = useState('');
  const [certType, setCertType] = useState<'File' | 'Text'>('File');

  const handleSave = () => {
    updateApiSettings({
      markupPercentage: parseFloat(markup) || 0,
      providers: providers,
      paymentGateways: paymentSettings,
      branding: branding,
    });
    Alert.alert('Imperial Success', 'System configuration has been deployed.');
    router.back();
  };

  const updatePaymentDetail = (field: keyof typeof paymentSettings, value: string) => {
    setPaymentSettings({ ...paymentSettings, [field]: value });
  };

  const addCertificate = () => {
    if (!certAlias || !certContent) {
      Alert.alert('Error', 'Please fill in all certificate details.');
      return;
    }

    const newCert = {
      id: Math.random().toString(36).substring(7),
      alias: certAlias,
      content: certContent,
      type: certType,
      addedAt: new Date().toISOString().split('T')[0],
    };

    updateApiSettings({
      certificates: [...(apiSettings.certificates || []), newCert]
    });

    setCertAlias('');
    setCertContent('');
    setShowCertModal(false);
    Alert.alert('Security Alert', 'New SSL/TLS Certificate has been bound to the system.');
  };

  const updateProviderDetail = (name: string, field: 'apiKey' | 'apiHost' | 'enabled', value: any) => {
    setProviders({
      ...providers,
      [name]: { ...providers[name], [field]: value }
    });
  };

  const toggleExpand = (name: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedProvider(expandedProvider === name ? null : name);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Imperial Core Engine</Text>
        <TouchableOpacity onPress={handleSave} style={styles.topSaveBtn}>
          <Text style={styles.topSaveText}>Deploy</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Branding & Assets Section */}
        <Text style={styles.sectionTitle}>BRANDING & ASSETS</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Application Logo Type</Text>
          <View style={styles.typeSelector}>
            {['Icon', 'FullText', 'Hybrid'].map(type => (
              <TouchableOpacity 
                key={type} 
                style={[styles.typeBtn, branding.logoType === type && styles.activeTypeBtn]}
                onPress={() => setBranding({...branding, logoType: type as any})}
              >
                <Text style={[styles.typeBtnText, branding.logoType === type && styles.activeTypeBtnText]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.innerInput}
            value={branding.companyName}
            onChangeText={(val) => setBranding({...branding, companyName: val})}
            placeholder="e.g. ecommerco.ai"
            placeholderTextColor="#444"
          />

          <Text style={styles.label}>Tagline</Text>
          <TextInput
            style={styles.innerInput}
            value={branding.tagline}
            onChangeText={(val) => setBranding({...branding, tagline: val})}
            placeholder="e.g. Imperial SaaS Hub"
            placeholderTextColor="#444"
          />
        </View>

        {/* Profit Engine Section */}
        <Text style={styles.sectionTitle}>PROFIT ENGINE (BROKERAGE)</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Global Markup Percentage</Text>
          <View style={styles.markupContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={markup}
              onChangeText={setMarkup}
              keyboardType="numeric"
              placeholder="15"
              placeholderTextColor="#444"
            />
            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>% PROFIT</Text>
            </View>
          </View>
        </View>

        {/* Payment Gateways Section - NEW */}
        <Text style={styles.sectionTitle}>PAYMENT GATEWAY HUB</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Active Gateway</Text>
          <View style={styles.typeSelector}>
            {['Stripe', 'Tap', 'NOWPayments', 'PayPal', 'Manual'].map(gateway => (
              <TouchableOpacity 
                key={gateway} 
                style={[styles.typeBtn, paymentSettings.activeGateway === gateway && styles.activeTypeBtn]}
                onPress={() => setPaymentSettings({...paymentSettings, activeGateway: gateway as any})}
              >
                <Text style={[styles.typeBtnText, paymentSettings.activeGateway === gateway && styles.activeTypeBtnText]}>{gateway}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {paymentSettings.activeGateway !== 'None' && (
            <View style={styles.expandedContent}>
              <View style={styles.divider} />
              
              {paymentSettings.activeGateway === 'PayPal' ? (
                <>
                  <Text style={styles.innerLabel}>PayPal Client ID</Text>
                  <TextInput
                    style={[styles.innerInput, { marginBottom: 15 }]}
                    value={paymentSettings.paypalClientId}
                    onChangeText={(val) => setPaymentSettings({...paymentSettings, paypalClientId: val})}
                    placeholder="Enter PayPal Client ID..."
                    placeholderTextColor="#333"
                  />
                  <Text style={styles.innerLabel}>PayPal Secret Key</Text>
                  <TextInput
                    style={styles.innerInput}
                    value={paymentSettings.paypalSecret}
                    onChangeText={(val) => setPaymentSettings({...paymentSettings, paypalSecret: val})}
                    placeholder="Enter PayPal Secret Key..."
                    placeholderTextColor="#333"
                    secureTextEntry
                  />
                </>
              ) : paymentSettings.activeGateway === 'Manual' ? (
                <>
                  <Text style={styles.innerLabel}>Broker Wallet Address (USDT)</Text>
                  <TextInput
                    style={[styles.innerInput, { marginBottom: 15 }]}
                    value={paymentSettings.manualCryptoAddress}
                    onChangeText={(val) => setPaymentSettings({...paymentSettings, manualCryptoAddress: val})}
                    placeholder="e.g. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
                    placeholderTextColor="#333"
                  />
                  <Text style={styles.innerLabel}>Network</Text>
                  <TextInput
                    style={styles.innerInput}
                    value={paymentSettings.manualCryptoNetwork}
                    onChangeText={(val) => setPaymentSettings({...paymentSettings, manualCryptoNetwork: val})}
                    placeholder="e.g. TRC20"
                    placeholderTextColor="#333"
                  />
                  <Text style={[styles.helperText, { marginTop: 10, color: '#FFD400' }]}>
                    Clients will see this address to send payment. You must verify the transaction manually to confirm bookings.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.innerLabel}>{paymentSettings.activeGateway} Secret Key</Text>
                  <TextInput
                    style={styles.innerInput}
                    value={
                      paymentSettings.activeGateway === 'Stripe' ? paymentSettings.stripeKey :
                      paymentSettings.activeGateway === 'Tap' ? paymentSettings.tapKey :
                      paymentSettings.nowPaymentsKey
                    }
                    onChangeText={(val) => {
                      const key = paymentSettings.activeGateway === 'Stripe' ? 'stripeKey' :
                                  paymentSettings.activeGateway === 'Tap' ? 'tapKey' : 'nowPaymentsKey';
                      updatePaymentDetail(key, val);
                    }}
                    placeholder={`Enter your ${paymentSettings.activeGateway} key...`}
                    placeholderTextColor="#333"
                    secureTextEntry
                  />
                </>
              )}
              
              <View style={styles.divider} />
              <Text style={styles.innerLabel}>Supported Payment Methods</Text>
              <View style={styles.methodsRow}>
                {Object.entries(paymentSettings.enabledMethods).map(([method, enabled]) => (
                  <TouchableOpacity 
                    key={method} 
                    style={[styles.methodChip, enabled && styles.activeMethodChip]}
                    onPress={() => setPaymentSettings({
                      ...paymentSettings, 
                      enabledMethods: { ...paymentSettings.enabledMethods, [method]: !enabled }
                    })}
                  >
                    <Text style={[styles.methodText, enabled && styles.activeMethodText]}>
                      {method === 'card' ? '💳 Credit Card' : 
                       method === 'paypal' ? '🅿️ PayPal' : 
                       method === 'applePay' ? '🍎 Apple Pay' : 
                       method === 'googlePay' ? '🤖 Google Pay' : '₿ Crypto'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.helperText}>
                All payments will be routed through this gateway to your Imperial bank account or wallet.
              </Text>
            </View>
          )}
        </View>

        {/* Security Certificates Section */}
        <View style={styles.card}>
          {apiSettings.certificates?.length > 0 ? (
            apiSettings.certificates.map(cert => (
              <View key={cert.id} style={styles.certRow}>
                <View>
                  <Text style={styles.certAlias}>{cert.alias}</Text>
                  <Text style={styles.certDate}>Added on {cert.addedAt}</Text>
                </View>
                <View style={styles.secureIndicator}>
                   <Text style={styles.secureTextMini}>ACTIVE</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noCertText}>No certificates installed.</Text>
          )}
          <TouchableOpacity 
            style={styles.addCertBtn} 
            onPress={() => setShowCertModal(true)}
          >
            <Text style={styles.addCertBtnText}>+ Add New Certificate</Text>
          </TouchableOpacity>
        </View>

        {/* Multi-API Providers Section */}
        <Text style={styles.sectionTitle}>API CONNECTIVITY HUB</Text>
        
        {Object.keys(providers).map((name) => (
          <View key={name} style={[styles.card, expandedProvider === name && styles.cardExpanded]}>
            <TouchableOpacity 
              style={styles.providerHeader} 
              onPress={() => toggleExpand(name)}
              activeOpacity={0.7}
            >
              <View style={styles.providerInfo}>
                <View style={[styles.statusDot, { backgroundColor: providers[name].enabled ? '#22C55E' : '#444' }]} />
                <Text style={styles.providerNameText}>{name}</Text>
              </View>
              <Text style={styles.expandIcon}>{expandedProvider === name ? '−' : '+'}</Text>
            </TouchableOpacity>

            {expandedProvider === name && (
              <View style={styles.expandedContent}>
                <View style={styles.divider} />
                
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.innerLabel}>Activation Status</Text>
                    <Switch
                      value={providers[name].enabled}
                      onValueChange={(val) => updateProviderDetail(name, 'enabled', val)}
                      trackColor={{ false: '#222', true: '#FFD400' }}
                      thumbColor={providers[name].enabled ? '#FFFFFF' : '#888'}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.innerLabel}>X-RapidAPI-Key</Text>
                  <TextInput
                    style={styles.innerInput}
                    value={providers[name].apiKey}
                    onChangeText={(val) => updateProviderDetail(name, 'apiKey', val)}
                    placeholder="Paste API Key here..."
                    placeholderTextColor="#333"
                    secureTextEntry
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.innerLabel}>X-RapidAPI-Host</Text>
                  <TextInput
                    style={styles.innerInput}
                    value={providers[name].apiHost}
                    onChangeText={(val) => updateProviderDetail(name, 'apiHost', val)}
                    placeholder="e.g. booking-com15.p.rapidapi.com"
                    placeholderTextColor="#333"
                  />
                </View>
                
                <Text style={styles.helperText}>
                  This configures the direct handshake between ecommerco.ai and {name} servers.
                </Text>
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Certificate Modal like in image */}
      <Modal
        visible={showCertModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add new Certificate</Text>
            
            <View style={styles.typeSelector}>
              <TouchableOpacity 
                style={[styles.typeBtn, certType === 'File' && styles.activeTypeBtn]}
                onPress={() => setCertType('File')}
              >
                <Text style={[styles.typeBtnText, certType === 'File' && styles.activeTypeBtnText]}>File</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeBtn, certType === 'Text' && styles.activeTypeBtn]}
                onPress={() => setCertType('Text')}
              >
                <Text style={[styles.typeBtnText, certType === 'Text' && styles.activeTypeBtnText]}>Text</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Alias *</Text>
              <TextInput
                style={styles.modalInput}
                value={certAlias}
                onChangeText={setCertAlias}
                placeholder="Certificate name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Certificate *</Text>
              {certType === 'File' ? (
                <TouchableOpacity style={styles.filePicker}>
                  <Text style={styles.filePickerText}>Choose File No file chosen</Text>
                </TouchableOpacity>
              ) : (
                <TextInput
                  style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
                  value={certContent}
                  onChangeText={setCertContent}
                  placeholder="Paste certificate text here..."
                  placeholderTextColor="#666"
                  multiline
                />
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCertModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveCertBtn} onPress={addCertificate}>
                <Text style={styles.saveCertBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTitle: {
    color: '#FFD400',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  topSaveBtn: {
    backgroundColor: '#FFD400',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  topSaveText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 12,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    color: '#444444',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 15,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  cardExpanded: {
    borderColor: '#FFD40030',
    backgroundColor: '#0F0F0A',
  },
  label: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  markupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTypeBtn: {
    backgroundColor: '#FFD400',
  },
  typeBtnText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '800',
  },
  activeTypeBtnText: {
    color: '#000',
  },
  methodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  methodChip: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeMethodChip: {
    borderColor: '#FFD400',
    backgroundColor: '#FFD40010',
  },
  methodText: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
  },
  activeMethodText: {
    color: '#FFD400',
  },
  percentBadge: {
    backgroundColor: '#FFD40020',
    paddingHorizontal: 15,
    height: 52,
    justifyContent: 'center',
    borderRadius: 12,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#FFD40040',
  },
  percentText: {
    color: '#FFD400',
    fontWeight: '900',
    fontSize: 12,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  providerNameText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  expandIcon: {
    color: '#FFD400',
    fontSize: 24,
    fontWeight: '300',
  },
  expandedContent: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#1A1A1A',
    marginVertical: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  innerInput: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: '#FFD400',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  helperText: {
    color: '#333',
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  certAlias: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  certDate: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },
  secureIndicator: {
    backgroundColor: '#22C55E15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  secureTextMini: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '800',
  },
  noCertText: {
    color: '#444',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  addCertBtn: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD400',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addCertBtnText: {
    color: '#FFD400',
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#222',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
  },
  modalInputGroup: {
    marginBottom: 20,
  },
  modalLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
  },
  filePicker: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  filePickerText: {
    color: '#666',
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: '#888',
    fontWeight: '600',
  },
  saveCertBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveCertBtnText: {
    color: '#FFF',
    fontWeight: '800',
  },
});
