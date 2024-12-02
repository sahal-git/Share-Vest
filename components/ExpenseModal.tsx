import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Colors from '@/constants/Colors';
import { ExpenseType } from '@/types';

interface ExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (expense: Partial<ExpenseType>) => void;
  expense?: ExpenseType;
}

export default function ExpenseModal({ visible, onClose, onSave, expense }: ExpenseModalProps) {
  const [amount, setAmount] = useState(expense?.amount?.toString() || '');
  const [category, setCategory] = useState(expense?.name || '');
  const [warning, setWarning] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const suggestions = [
    'Food',
    'Housing',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Utilities',
    'Healthcare',
    'Insurance',
    'Savings',
    'Investments',
    'Education',
    'Travel',
    'Groceries',
    'Personal Care',
    'Gifts'
  ];

  const handleAmountChange = (text: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanedText.split('.');
    if (parts.length > 2) return;
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) return;
    
    // Don't allow multiple zeros at start
    if (cleanedText.startsWith('00')) return;
    
    setAmount(cleanedText);
  };

  const handleCategoryChange = (text: string) => {
    setCategory(text);
    setWarning('');
    
    if (text.trim()) {
      const filtered = suggestions.filter(
        suggestion => suggestion.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setCategory(suggestion);
    setFilteredSuggestions([]);
  };

  const handleSave = () => {
    if (!category.trim()) {
      return;
    }
    const formattedAmount = parseFloat(amount || '0').toFixed(2);
    
    onSave({
      amount: parseFloat(formattedAmount),
      name: category.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' '),
      percentage: 0,
    });
    setAmount('');
    setCategory('');
    setWarning('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {expense ? 'Update' : 'Add'} Expense
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { marginBottom: warning ? 5 : filteredSuggestions.length ? 0 : 15 }]}
              placeholder="Category"
              value={category}
              onChangeText={handleCategoryChange}
              placeholderTextColor="#666"
              autoCapitalize="words"
              returnKeyType="next"
              blurOnSubmit={false}
            />
            
            {filteredSuggestions.length > 0 && (
              <ScrollView 
                style={styles.suggestionsContainer}
                keyboardShouldPersistTaps="handled"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
          
          {warning ? (
            <Text style={styles.warningText}>
              {warning}
            </Text>
          ) : null}
          
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            placeholderTextColor="#666"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={handleSave}
            maxLength={10} // Prevent extremely large numbers
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.gray,
    padding: 20,
    borderRadius: 15,
    width: '80%',
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.black,
    color: Colors.white,
    padding: 10,
    borderRadius: 8,
    height: 45,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: Colors.gray,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  saveButton: {
    backgroundColor: Colors.tintColor,
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  warningText: {
    color: '#FFA500',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  inputContainer: {
    position: 'relative',
    zIndex: 1,
  },
  suggestionsContainer: {
    maxHeight: 150,
    backgroundColor: Colors.black,
    borderRadius: 8,
    marginBottom: 15,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  suggestionText: {
    color: Colors.white,
    fontSize: 14,
  },
}); 