import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

const QuizQuestion = ({ question, selectedAnswer, submitted, onSelect }) => {
  const getOptionStyle = (index) => {
    if (!submitted) {
      return selectedAnswer === index ? styles.optionSelected : styles.option;
    }
    if (index === question.correctIndex) return styles.optionCorrect;
    if (selectedAnswer === index && index !== question.correctIndex) return styles.optionWrong;
    return styles.option;
  };

  const getOptionTextStyle = (index) => {
    if (!submitted) {
      return selectedAnswer === index ? styles.optionTextSelected : styles.optionText;
    }
    if (index === question.correctIndex) return styles.optionTextCorrect;
    if (selectedAnswer === index && index !== question.correctIndex) return styles.optionTextWrong;
    return styles.optionText;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.question}</Text>
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={getOptionStyle(index)}
          onPress={() => onSelect(question.id, index)}
          disabled={submitted}
          activeOpacity={0.7}
        >
          <Text style={styles.optionLetter}>
            {String.fromCharCode(65 + index)}.
          </Text>
          <Text style={getOptionTextStyle(index)}>{option}</Text>
          {submitted && index === question.correctIndex && (
            <Text style={styles.resultIcon}>✓</Text>
          )}
          {submitted && selectedAnswer === index && index !== question.correctIndex && (
            <Text style={styles.resultIcon}>✗</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  question: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 14,
    lineHeight: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  optionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  optionLetter: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
    width: 24,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  optionTextSelected: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  optionTextCorrect: {
    flex: 1,
    fontSize: 15,
    color: COLORS.success,
    fontWeight: '600',
  },
  optionTextWrong: {
    flex: 1,
    fontSize: 15,
    color: COLORS.error,
    fontWeight: '600',
  },
  resultIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
});

export default QuizQuestion;
