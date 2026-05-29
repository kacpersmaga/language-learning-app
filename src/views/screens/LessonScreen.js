import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { LESSONS, STAGE_TYPES } from '../../models/Lesson';
import { useLessonViewModel } from '../../viewmodels/LessonViewModel';
import { useProgressViewModel } from '../../viewmodels/ProgressViewModel';
import QuizQuestion from '../components/QuizQuestion';
import StageProgressBar from '../components/StageProgressBar';
import { COLORS } from '../theme';
import { NotificationService } from '../../services/NotificationService';

const LessonScreen = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const lesson = LESSONS.find(l => l.id === lessonId);
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;

  const vm = useLessonViewModel(lesson);
  const { completeLesson } = useProgressViewModel();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateStage = useCallback(() => {
    slideAnim.setValue(50);
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  useEffect(() => {
    animateStage();
  }, [vm.currentStageIndex]);

  const handleNext = async () => {
    if (vm.currentStage?.type === STAGE_TYPES.QUIZ && !vm.quizSubmitted) {
      const questions = vm.currentStage.content.questions;
      const answered = Object.keys(vm.quizAnswers).length;
      if (answered < questions.length) {
        Alert.alert('Answer all questions', 'Please answer all questions before submitting.');
        return;
      }
      vm.submitQuiz();
      return;
    }

    if (vm.isLastStage) {
      const { correct, total } = vm.getQuizResults();
      const result = await completeLesson(lessonId, correct, total);
      await NotificationService.sendImmediateNotification(
        'Lesson complete!',
        `You scored ${result.score}% — ${result.grade.label}`
      );
      navigation.navigate('Progress');
    } else {
      vm.goNext();
    }
  };

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text>Lesson not found.</Text>
      </View>
    );
  }

  const renderStageContent = () => {
    const stage = vm.currentStage;
    if (!stage) return null;

    switch (stage.type) {
      case STAGE_TYPES.INTRODUCTION:
        return <IntroStage content={stage.content} isLandscape={isLandscape} />;
      case STAGE_TYPES.VOCABULARY:
        return (
          <VocabStage
            content={stage.content}
            wordDetails={vm.wordDetails}
            loadingWord={vm.loadingWord}
            onLookup={vm.lookupWord}
            isLandscape={isLandscape}
          />
        );
      case STAGE_TYPES.EXAMPLES:
        return <ExamplesStage content={stage.content} isLandscape={isLandscape} />;
      case STAGE_TYPES.QUIZ:
        return (
          <QuizStage
            content={stage.content}
            quizAnswers={vm.quizAnswers}
            quizSubmitted={vm.quizSubmitted}
            onAnswer={vm.answerQuestion}
            isLandscape={isLandscape}
          />
        );
      case STAGE_TYPES.SUMMARY:
        return <SummaryStage content={stage.content} results={vm.getQuizResults()} />;
      default:
        return null;
    }
  };

  const getNextLabel = () => {
    if (vm.currentStage?.type === STAGE_TYPES.QUIZ && !vm.quizSubmitted) return 'Submit Quiz';
    if (vm.isLastStage) return 'Finish Lesson';
    return 'Next';
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={{ width: 60 }} />
      </View>

      <StageProgressBar current={vm.currentStageIndex} total={vm.totalStages} />

      <Text style={styles.stageLabel}>{vm.currentStage?.title}</Text>

      <ScrollView
        contentContainerStyle={[styles.content, isLandscape && styles.contentLandscape]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          {renderStageContent()}
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, isLandscape && styles.footerLandscape]}>
        {vm.currentStageIndex > 0 && (
          <TouchableOpacity style={styles.prevBtn} onPress={vm.goPrev}>
            <Text style={styles.prevBtnText}>‹ Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>{getNextLabel()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const IntroStage = ({ content, isLandscape }) => (
  <View style={isLandscape ? { flexDirection: 'row', gap: 16 } : {}}>
    <View style={{ flex: 1 }}>
      <Text style={stageStyles.bodyText}>{content.text}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={stageStyles.sectionHeader}>Tips</Text>
      {content.tips.map((tip, i) => (
        <View key={i} style={stageStyles.tipRow}>
          <Text style={stageStyles.tipBullet}>💡</Text>
          <Text style={stageStyles.tipText}>{tip}</Text>
        </View>
      ))}
    </View>
  </View>
);

const VocabStage = ({ content, wordDetails, loadingWord, onLookup, isLandscape }) => (
  <View>
    <Text style={stageStyles.sectionHeader}>Words to learn</Text>
    {content.words.map((item) => (
      <View key={item.word} style={stageStyles.wordCard}>
        <View style={stageStyles.wordHeader}>
          <View>
            <Text style={stageStyles.word}>{item.word}</Text>
            <Text style={stageStyles.phonetic}>{item.phonetic}</Text>
          </View>
          <Text style={stageStyles.translation}>{item.translation}</Text>
          <TouchableOpacity
            style={stageStyles.lookupBtn}
            onPress={() => onLookup(item.word)}
            disabled={loadingWord}
          >
            {loadingWord ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={stageStyles.lookupBtnText}>🔍</Text>
            )}
          </TouchableOpacity>
        </View>
        {wordDetails[item.word] && (
          <View style={stageStyles.dictResult}>
            {wordDetails[item.word].meanings?.map((m, i) => (
              <View key={i} style={{ marginTop: 6 }}>
                <Text style={stageStyles.partOfSpeech}>{m.partOfSpeech}</Text>
                <Text style={stageStyles.definition}>{m.definition}</Text>
                {m.example ? (
                  <Text style={stageStyles.example}>e.g. "{m.example}"</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </View>
    ))}
  </View>
);

const ExamplesStage = ({ content }) => (
  <View>
    <Text style={stageStyles.sectionHeader}>Practice dialogues</Text>
    {content.dialogues.map((dialogue) => (
      <View key={dialogue.id} style={stageStyles.dialogueCard}>
        {dialogue.lines.map((line, i) => (
          <View
            key={i}
            style={[
              stageStyles.dialogueLine,
              line.speaker === 'B' && stageStyles.dialogueLineRight,
            ]}
          >
            <View
              style={[
                stageStyles.bubble,
                line.speaker === 'B' && stageStyles.bubbleRight,
              ]}
            >
              <Text style={stageStyles.speakerLabel}>{line.speaker}</Text>
              <Text style={stageStyles.bubbleText}>{line.text}</Text>
            </View>
          </View>
        ))}
      </View>
    ))}
  </View>
);

const QuizStage = ({ content, quizAnswers, quizSubmitted, onAnswer }) => (
  <View>
    <Text style={stageStyles.sectionHeader}>Test your knowledge</Text>
    {content.questions.map((q, i) => (
      <View key={q.id}>
        <Text style={stageStyles.questionNumber}>Question {i + 1} of {content.questions.length}</Text>
        <QuizQuestion
          question={q}
          selectedAnswer={quizAnswers[q.id]}
          submitted={quizSubmitted}
          onSelect={onAnswer}
        />
      </View>
    ))}
  </View>
);

const SummaryStage = ({ content, results }) => (
  <View style={stageStyles.summaryContainer}>
    <Text style={stageStyles.summaryEmoji}>🎉</Text>
    <Text style={stageStyles.summaryTitle}>Lesson Complete!</Text>
    <View style={stageStyles.scoreBox}>
      <Text style={stageStyles.scoreLabel}>Your score</Text>
      <Text style={stageStyles.scoreValue}>
        {results.total > 0
          ? `${results.correct}/${results.total}`
          : '—'}
      </Text>
    </View>
    {content.points.map((p, i) => (
      <View key={i} style={stageStyles.tipRow}>
        <Text style={stageStyles.tipBullet}>✅</Text>
        <Text style={stageStyles.tipText}>{p}</Text>
      </View>
    ))}
    <Text style={stageStyles.encouragement}>{content.encouragement}</Text>
  </View>
);

const stageStyles = StyleSheet.create({
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: 20,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  tipBullet: {
    fontSize: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  word: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  phonetic: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  translation: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'right',
  },
  lookupBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lookupBtnText: {
    fontSize: 20,
  },
  dictResult: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  partOfSpeech: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  definition: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 2,
  },
  example: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  dialogueCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  dialogueLine: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  dialogueLineRight: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
  },
  bubbleRight: {
    backgroundColor: '#E8F5E9',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
  },
  speakerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: 15,
    color: COLORS.text,
  },
  questionNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  summaryContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  summaryEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 20,
  },
  scoreBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  scoreLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primary,
  },
  encouragement: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 60,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  stageLabel: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  contentLandscape: {
    paddingHorizontal: 48,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerLandscape: {
    paddingHorizontal: 48,
  },
  prevBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  prevBtnText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});

export default LessonScreen;
