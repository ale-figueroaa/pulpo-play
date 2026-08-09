import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { styles } from '../styles/dashboard.style';
import { supabase } from '../lib/supabase';
import { getWeeklyProgress, getUserProfileByAuthId, getRecentActivity } from '../utils/db';
export default function AdultDashboardScreen() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [errorText, setErrorText] = useState('');
  const [chartData, setChartData] = useState<{ day: string, minutes: number, correct: number }[]>([]);
  const [mathProblem, setMathProblem] = useState({ text: '25 ÷ 5 = ?', answer: '5' });
  const [userName, setUserName] = useState<string>('Diver');
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Generate a random division problem on mount
  useEffect(() => {
    const num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const num2 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const product = num1 * num2;
    setMathProblem({
      text: `${product} ÷ ${num1} = ?`,
      answer: num2.toString()
    });
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      loadData();
    }
  }, [isUnlocked]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Cleanup old debug data
        await supabase.from('GameSession').delete().eq('gameName', 'Debug Game');

        const profile = await getUserProfileByAuthId(user.id);
        if (profile) setUserName(profile.nombreUsuario);

        const data = await getWeeklyProgress(user.id);
        setChartData(data);

        const activity = await getRecentActivity(user.id);
        setRecentActivity(activity);
      }
    } catch (err: any) {
      console.error('Exception:', err);
    }
  };

  const handleUnlock = () => {
    if (mathAnswer.trim() === mathProblem.answer) {
      setIsUnlocked(true);
      setErrorText('');
    } else {
      setErrorText('Incorrect answer. Please try again.');
      setMathAnswer('');
    }
  };

  const handleBackToProfile = () => {
    router.replace('/(tabs)/profile' as any);
  };

  // Find max values to scale the bars correctly
  const maxMinutes = chartData.length > 0 ? Math.max(...chartData.map(d => d.minutes)) : 0;
  const maxCorrect = chartData.length > 0 ? Math.max(...chartData.map(d => d.correct)) : 0;
  const maxScale = Math.max(maxMinutes, maxCorrect, 10) * 1.1; // Add 10% headroom, minimum 10 scale

  // Compute totals
  const totalMinutes = chartData.reduce((acc, val) => acc + val.minutes, 0);
  const totalCorrect = chartData.reduce((acc, val) => acc + val.correct, 0);
  const totalGames = Math.floor(totalCorrect / 10);
  const totalXP = recentActivity.reduce((acc, val) => acc + (val.xpEarned || 0), 0); // Estimate from recent if needed, or rely on profile for total XP

  return (
    <LinearGradient
      colors={['#03245a', '#5a9eff']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientContainer}
    >
      {/* --- MATH GATE MODAL --- */}
      {!isUnlocked && (
        <View style={styles.modalOverlay}>
          <View style={styles.gateCard}>
            <Text style={styles.gateTitle}>For Adults Only</Text>
            <Text style={styles.gateSubtitle}>To access the progress dashboard, please solve this math problem:</Text>
            
            <Text style={styles.mathProblem}>{mathProblem.text}</Text>
            
            {errorText ? <Text style={styles.gateError}>{errorText}</Text> : null}

            <TextInput
              style={styles.gateInput}
              keyboardType="number-pad"
              value={mathAnswer}
              onChangeText={setMathAnswer}
              placeholder="Your answer"
              placeholderTextColor="#90A4AE"
              maxLength={2}
              onSubmitEditing={handleUnlock}
            />

            <TouchableOpacity style={styles.gateButton} onPress={handleUnlock} activeOpacity={0.8}>
              <Text style={styles.gateButtonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backToAppButton} onPress={handleBackToProfile}>
              <Text style={styles.backToAppText}>Back to App</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* --- ADULT DASHBOARD --- */}
      {isUnlocked && (
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>{userName}'s Progress</Text>
              <TouchableOpacity style={styles.backButton} onPress={handleBackToProfile} activeOpacity={0.8}>
                <Text style={styles.backButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>

            {/* Summary Cards */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
              <View style={[styles.summaryCard, { flex: 1, minWidth: 140 }]}>
                <Text style={styles.summaryValue}>{totalMinutes}m</Text>
                <Text style={styles.summaryLabel}>Playtime</Text>
              </View>
              <View style={[styles.summaryCard, { flex: 1, minWidth: 140 }]}>
                <Text style={styles.summaryValue}>{totalCorrect}</Text>
                <Text style={styles.summaryLabel}>Correct</Text>
              </View>
              <View style={[styles.summaryCard, { flex: 1, minWidth: 140 }]}>
                <Text style={styles.summaryValue}>{totalGames}</Text>
                <Text style={styles.summaryLabel}>Games Finished</Text>
              </View>
              <View style={[styles.summaryCard, { flex: 1, minWidth: 140 }]}>
                <Text style={styles.summaryValue}>{totalXP}</Text>
                <Text style={styles.summaryLabel}>XP Earned</Text>
              </View>
            </View>

            {/* Graph Section */}
            <View style={styles.graphSection}>
              <Text style={styles.sectionTitle}>Weekly Activity</Text>
              <Text style={styles.sectionSubtitle}>Compare minutes played against correct answers over the last 7 days.</Text>
              
              <View style={styles.chartContainer}>
                {chartData.map((data, index) => {
                  const minutesHeight = (data.minutes / maxScale) * 100;
                  const correctHeight = (data.correct / maxScale) * 100;
                  
                  return (
                    <View key={index} style={styles.barColumn}>
                      <View style={styles.barsWrapper}>
                        <View style={[styles.barMinutes, { height: `${minutesHeight}%` }]} />
                        <View style={[styles.barCorrect, { height: `${correctHeight}%` }]} />
                      </View>
                      <Text style={styles.barLabel}>{data.day}</Text>
                    </View>
                  );
                })}
              </View>

              {/* Legend */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={styles.legendColorBlue} />
                  <Text style={styles.legendText}>Minutes Played</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendColorGreen} />
                  <Text style={styles.legendText}>Correct Answers</Text>
                </View>
              </View>
            </View>

            {/* Recent Activity Section */}
            <View style={styles.graphSection}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Text style={styles.sectionSubtitle}>The most recent games played.</Text>
              
              <View style={styles.activityList}>
                {recentActivity.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: '#7F8C9D', marginVertical: 10 }}>No recent games found.</Text>
                ) : (
                  recentActivity.map((session, index) => {
                    const date = new Date(session.createdAt).toLocaleDateString();
                    return (
                      <View key={index} style={styles.activityItem}>
                        <View>
                          <Text style={styles.activityGameName}>{session.gameName}</Text>
                          <Text style={styles.activityDate}>{date}</Text>
                        </View>
                        <View style={styles.activityStats}>
                          <Text style={styles.activityStatText}>{session.xpEarned} XP</Text>
                          <Text style={styles.activityStatText}>{session.minutesPlayed}m</Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </LinearGradient>
  );
}
