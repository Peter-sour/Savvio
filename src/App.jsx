import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Wallet, TrendingUp, Calendar, Trash2, ChevronLeft, ChevronRight, Save, RotateCcw } from 'lucide-react';

const ExpenseTracker = () => {
  // State management dengan default values
  const [tempMonthlyIncome, setTempMonthlyIncome] = useState(200000);
  const [monthlyIncome, setMonthlyIncome] = useState(200000);
  const [dailyBudget, setDailyBudget] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [newExpense, setNewExpense] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [showBudgetSaved, setShowBudgetSaved] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // LOAD DATA DARI LOCALSTORAGE SAAT PERTAMA KALI
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('expenseTrackerData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('🔄 Loading data from localStorage:', parsed);

        // Set semua state dari localStorage
        setMonthlyIncome(parsed.monthlyIncome || 200000);
        setTempMonthlyIncome(parsed.tempMonthlyIncome || parsed.monthlyIncome || 200000);
        setCurrentDay(parsed.currentDay || 1);
        setTransactions(parsed.transactions || []);
        setTotalSavings(parsed.totalSavings || 0);

        console.log('✅ Data berhasil dimuat!');
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
    }
    setIsDataLoaded(true);
  }, []);

  // AUTO-SAVE KE LOCALSTORAGE SETIAP STATE BERUBAH
  useEffect(() => {
    if (!isDataLoaded) return; // Jangan save saat masih loading

    const dataToSave = {
      monthlyIncome,
      tempMonthlyIncome,
      currentDay,
      transactions,
      totalSavings,
      lastUpdated: new Date().toISOString(),
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('expenseTrackerData', JSON.stringify(dataToSave));
      console.log('💾 Auto-saved to localStorage:', {
        monthlyIncome,
        tempMonthlyIncome,
        currentDay,
        transactionsCount: transactions.length,
        totalSavings
      });
    } catch (error) {
      console.error('❌ Error saving data:', error);
    }
  }, [monthlyIncome, tempMonthlyIncome, currentDay, transactions, totalSavings, isDataLoaded]);

  // Simpan budget baru
  const saveBudget = () => {
    console.log('💰 Saving new budget:', tempMonthlyIncome);
    setMonthlyIncome(tempMonthlyIncome);
    setShowBudgetSaved(true);
    setTimeout(() => setShowBudgetSaved(false), 2000);
  };

  // Reset ke budget lama
  const resetBudget = () => {
    console.log('🔄 Resetting budget to:', monthlyIncome);
    setTempMonthlyIncome(monthlyIncome);
  };

  // Hitung budget harian saat monthly income berubah
  useEffect(() => {
    const daily = Math.floor(monthlyIncome / 30);
    setDailyBudget(daily);
    console.log('📊 Daily budget updated:', daily);
  }, [monthlyIncome]);

  // Hitung total tabungan berdasarkan transaksi
  useEffect(() => {
    const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalBudgetUsed = currentDay * dailyBudget;
    const newTotalSavings = totalBudgetUsed - totalExpenses;
    setTotalSavings(newTotalSavings);
    console.log('💰 Savings calculated:', { totalExpenses, totalBudgetUsed, newTotalSavings });
  }, [transactions, currentDay, dailyBudget]);

  const addExpense = () => {
    if (newExpense && expenseAmount && parseFloat(expenseAmount) > 0) {
      const amount = parseFloat(expenseAmount);
      const daysUsed = Math.ceil(amount / dailyBudget);

      const newTransaction = {
        id: Date.now(),
        description: newExpense,
        amount: amount,
        daysUsed: daysUsed,
        date: new Date().toLocaleDateString('id-ID'),
        timestamp: Date.now()
      };

      console.log('➕ Adding expense:', newTransaction);
      setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
      setNewExpense('');
      setExpenseAmount('');
    }
  };

  const deleteTransaction = (id) => {
    console.log('🗑️ Deleting transaction:', id);
    setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction.id !== id));
  };

  const addDay = () => {
    const newDay = currentDay + 1;
    console.log('📅 Adding day:', newDay);
    setCurrentDay(newDay);
  };

  const subtractDay = () => {
    if (currentDay > 1) {
      const newDay = currentDay - 1;
      console.log('📅 Subtracting day:', newDay);
      setCurrentDay(newDay);
    }
  };

  const resetMonth = () => {
    console.log('🔄 Resetting month data');
    setTransactions([]);
    setCurrentDay(1);
    setTotalSavings(0);

    // Juga clear dari localStorage untuk reset month
    try {
      const currentData = JSON.parse(localStorage.getItem('expenseTrackerData') || '{}');
      const resetData = {
        ...currentData,
        transactions: [],
        currentDay: 1,
        totalSavings: 0,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('expenseTrackerData', JSON.stringify(resetData));
      console.log('🗑️ Month data cleared from localStorage');
    } catch (error) {
      console.error('❌ Error resetting month data:', error);
    }
  };

  // Manual save function untuk testing
  const manualSave = () => {
    const dataToSave = {
      monthlyIncome,
      tempMonthlyIncome,
      currentDay,
      transactions,
      totalSavings,
      lastUpdated: new Date().toISOString(),
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('expenseTrackerData', JSON.stringify(dataToSave));
      console.log('💾 Manual save successful:', dataToSave);
      alert('Data berhasil disimpan!');
    } catch (error) {
      console.error('❌ Manual save failed:', error);
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  // Manual load function untuk testing
  const manualLoad = () => {
    try {
      const savedData = localStorage.getItem('expenseTrackerData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('🔄 Manual load:', parsed);

        setMonthlyIncome(parsed.monthlyIncome || 200000);
        setTempMonthlyIncome(parsed.tempMonthlyIncome || parsed.monthlyIncome || 200000);
        setCurrentDay(parsed.currentDay || 1);
        setTransactions(parsed.transactions || []);
        setTotalSavings(parsed.totalSavings || 0);

        alert('Data berhasil dimuat!');
      } else {
        alert('Tidak ada data tersimpan!');
      }
    } catch (error) {
      console.error('❌ Manual load failed:', error);
      alert('Gagal memuat data: ' + error.message);
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRemainingDays = () => {
    const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const daysUsedByExpenses = Math.ceil(totalExpenses / dailyBudget);
    return Math.max(0, currentDay - daysUsedByExpenses);
  };

  const getStatus = () => {
    const remainingDays = getRemainingDays();
    if (remainingDays > 0) {
      return { text: `Kamu punya saldo ${remainingDays} hari (${formatRupiah(remainingDays * dailyBudget)})`, color: 'text-green-600', bgColor: 'bg-green-50' };
    } else if (remainingDays === 0) {
      return { text: 'Budget pas-pasan, hati-hati ya!', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    } else {
      return { text: `Kamu "ngutang" ${Math.abs(remainingDays)} hari ke depan`, color: 'text-red-600', bgColor: 'bg-red-50' };
    }
  };

  const status = getStatus();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-3xl opacity-10"></div>
        <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <div className="text-3xl">💰</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Tracker Pengeluaran & Tabungan
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Kelola uang bulanan dengan sistem budget harian
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Smart Budgeting
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Auto Save
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Daily Tracking
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel - Hapus di production */}
      <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-sm text-yellow-800 mb-2">🛠️ Debug Panel (untuk testing):</div>
        <div className="flex space-x-2">
          <button onClick={manualSave} className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
            Manual Save
          </button>
          <button onClick={manualLoad} className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
            Manual Load
          </button>
          <button onClick={() => console.log('Current state:', { monthlyIncome, tempMonthlyIncome, currentDay, transactions: transactions.length, totalSavings })} className="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600">
            Log State
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Wallet className="text-blue-600" size={20} />
            </div>
            Pengaturan Budget
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penghasilan per Bulan
              </label>
              <input
                type="number"
                value={tempMonthlyIncome}
                onChange={(e) => setTempMonthlyIncome(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="200000"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-600">
              Preview budget per hari: <span className="font-semibold text-blue-600">
                {formatRupiah(Math.floor(tempMonthlyIncome / 30))}
              </span>
            </div>

            {/* Tombol Aksi Budget */}
            <div className="flex space-x-2">
              <button
                onClick={saveBudget}
                disabled={tempMonthlyIncome === monthlyIncome}
                className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center font-medium ${
                  tempMonthlyIncome === monthlyIncome
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md'
                }`}
              >
                <Save className="mr-2" size={16} />
                Simpan Budget
              </button>

              <button
                onClick={resetBudget}
                disabled={tempMonthlyIncome === monthlyIncome}
                className={`px-4 py-3 rounded-lg transition-all flex items-center justify-center ${
                  tempMonthlyIncome === monthlyIncome
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600 shadow-sm'
                }`}
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Notifikasi Budget Tersimpan */}
            {showBudgetSaved && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <div className="flex items-center text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Budget berhasil disimpan!</span>
                </div>
              </div>
            )}

            {/* Budget Saat Ini */}
            <div className="border-t pt-3">
              <div className="text-xs text-gray-500 mb-1">Budget Aktif:</div>
              <div className="font-semibold text-blue-600">{formatRupiah(monthlyIncome)}/bulan</div>
              <div className="text-sm text-gray-600">= {formatRupiah(dailyBudget)}/hari</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <Calendar className="text-purple-600" size={20} />
            </div>
            Status Hari Ini
          </h3>
          <div className="space-y-4">
            <div className="text-2xl font-bold text-purple-600">Hari ke-{currentDay}</div>
            <div className={`p-4 rounded-lg border-l-4 ${status.bgColor} ${status.color.replace('text-', 'border-')}`}>
              <div className={`text-sm font-medium ${status.color}`}>
                {status.text}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={subtractDay}
                disabled={currentDay <= 1}
                className={`flex-1 px-4 py-2 rounded-lg transition-all flex items-center justify-center ${
                  currentDay <= 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md'
                }`}
              >
                <ChevronLeft className="mr-1" size={16} />
                Mundur Hari
              </button>
              <button
                onClick={addDay}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
              >
                Tambah Hari
                <ChevronRight className="ml-1" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Tabungan</p>
              <p className="text-xl font-bold text-green-700">{formatRupiah(totalSavings)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Pengeluaran</p>
              <p className="text-xl font-bold text-blue-700">
                {formatRupiah(transactions.reduce((sum, t) => sum + t.amount, 0))}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <MinusCircle className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Budget Terpakai</p>
              <p className="text-xl font-bold text-orange-700">{formatRupiah(currentDay * dailyBudget)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Wallet className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <PlusCircle className="text-blue-600" size={20} />
          </div>
          Tambah Pengeluaran
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            value={newExpense}
            onChange={(e) => setNewExpense(e.target.value)}
            placeholder="Deskripsi pembelian..."
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <input
            type="number"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            placeholder="Jumlah (Rp)"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <button
            onClick={addExpense}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
          >
            <PlusCircle className="mr-2" size={16} />
            Tambah
          </button>
        </div>
        {expenseAmount && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            💡 Pembelian ini akan "menggunakan" <span className="font-medium">{Math.ceil(parseFloat(expenseAmount || 0) / dailyBudget)} hari</span> budget
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Riwayat Pengeluaran</h3>
          <button
            onClick={resetMonth}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all text-sm shadow-sm hover:shadow-md"
          >
            Reset Bulan
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🎉</div>
            <div>Belum ada pengeluaran bulan ini</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{transaction.description}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    📅 {transaction.date} • ⏰ Menggunakan {transaction.daysUsed} hari budget
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold text-red-600">
                    -{formatRupiah(transaction.amount)}
                  </div>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 bg-white p-4 rounded-lg">
        💡 <span className="font-medium">Tip:</span> Semakin sedikit pengeluaran, semakin banyak tabungan!
        <br />
        💾 <span className="font-medium">Data otomatis tersimpan di localStorage</span> - tidak hilang saat refresh!
        <br />
        🔍 <span className="text-xs">Buka Console (F12) untuk melihat log penyimpanan data</span>
      </div>
    </div>
  );
};

export default ExpenseTracker;