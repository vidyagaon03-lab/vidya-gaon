import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import StudentProfile from '@/components/StudentProfile';
import { BookOpen, Star, Trophy, Clock } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  difficulty: number;
}

interface Progress {
  lesson_id: string;
  stars: number;
  score: number;
  completed_at: string;
}

interface Achievement {
  id: string;
  achievement: string;
  stars: number;
  created_at: string;
}

const StudentDashboard = () => {
  const { profile } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      // Fetch lessons
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .order('difficulty');

      // Fetch student progress
      const { data: progressData } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', profile?.id);

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from('community_wall')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      setLessons(lessonsData || []);
      setProgress(progressData || []);
      setAchievements(achievementsData || []);

      // Calculate total stars
      const stars = (progressData || []).reduce((sum, p) => sum + p.stars, 0);
      setTotalStars(stars);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForLesson = (lessonId: string) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const completedLessons = progress.length;
  const completionPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Profile */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Welcome back, {profile?.name}! 🎓
            </h1>
            <p className="text-muted-foreground">Continue your learning journey in Vidya Gaon</p>
          </div>
          <StudentProfile 
            totalStars={totalStars} 
            completedLessons={completedLessons}
            achievements={achievements}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{totalStars}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{completedLessons}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{achievements.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{Math.round(completionPercentage)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Your overall progress in Vidya Gaon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Completion</span>
                <span>{completedLessons}/{lessons.length} lessons</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Available Lessons */}
        <Card className="bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Available Lessons</CardTitle>
            <CardDescription>Continue learning with these lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((lesson) => {
                const lessonProgress = getProgressForLesson(lesson.id);
                const isCompleted = !!lessonProgress;
                
                return (
                  <Card key={lesson.id} className={`cursor-pointer transition-all hover:scale-105 ${
                    isCompleted ? 'bg-green-50 border-green-200' : 'bg-background'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        {isCompleted && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-bold">{lessonProgress.stars}</span>
                          </div>
                        )}
                      </div>
                      <CardDescription>{lesson.subject}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant={isCompleted ? "default" : "secondary"}>
                          Difficulty: {lesson.difficulty}/5
                        </Badge>
                        <Button size="sm" variant={isCompleted ? "secondary" : "default"}>
                          {isCompleted ? 'Review' : 'Start'}
                        </Button>
                      </div>
                      {isCompleted && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Score: {lessonProgress.score}%
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <Card className="bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your latest accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.slice(0, 5).map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">{achievement.achievement}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(achievement.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-bold">{achievement.stars}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;