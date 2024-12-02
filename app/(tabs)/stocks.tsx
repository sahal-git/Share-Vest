import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import StockList from "@/data/stocks.json";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StockCard from "@/components/StockCard";

export default function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // Get unique industries from stock list
  const industries = Array.from(new Set(StockList.map(stock => stock.industry)));

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const filteredStocks = StockList.filter(stock => {
    const matchesSearch = searchQuery === '' || 
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.financial_details.non_compliant_income_ratio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedIndustries.length === 0 || 
      selectedIndustries.includes(stock.industry);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Stocks</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.iconButton}   
                onPress={() => router.push('/(screens)/notifications')}
              >
                <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.iconButton,
                  selectedIndustries.length > 0 && styles.activeFilter
                ]} 
                onPress={() => setShowFilters(true)}
              >
                <MaterialCommunityIcons name="filter-variant" size={24} color={Colors.white} />
                {selectedIndustries.length > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{selectedIndustries.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search stocks..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.section, { paddingBottom: 100 }]}>
            {filteredStocks.map((stock) => (
              <StockCard key={stock.id} stock={stock} showTag={true} />
            ))}
            {filteredStocks.length === 0 && (
              <Text style={styles.noResults}>No stocks found</Text>
            )}
          </View>
        </ScrollView>

        {/* Filter Modal */}
        <Modal
          visible={showFilters}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFilters(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter by Industry</Text>
                <TouchableOpacity onPress={() => setShowFilters(false)}>
                  <MaterialCommunityIcons name="close" size={24} color={Colors.white} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.filterList}>
                {industries.map((industry) => (
                  <TouchableOpacity
                    key={industry}
                    style={[
                      styles.filterItem,
                      selectedIndustries.includes(industry) && styles.selectedFilter
                    ]}
                    onPress={() => toggleIndustry(industry)}
                  >
                    <Text style={[
                      styles.filterText,
                      selectedIndustries.includes(industry) && styles.selectedFilterText
                    ]}>
                      {industry}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setSelectedIndustries([])}
                >
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={() => setShowFilters(false)}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: Colors.tintColor,
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: Colors.black,
    fontSize: 10,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
    marginLeft: 8,
    marginRight: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.black,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFilter: {
    backgroundColor: Colors.tintColor,
  },
  filterText: {
    color: Colors.white,
    fontSize: 16,
  },
  selectedFilterText: {
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  clearButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.white,
    alignItems: 'center',
  },
  clearButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.tintColor,
    alignItems: 'center',
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  noResults: {
    color: Colors.white,
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
});
