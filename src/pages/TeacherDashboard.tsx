import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Users, BookOpen, BarChart3, Star, GraduationCap } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  avatar?: string;
  language: string;
  total_stars: number;
  completed_lessons: number;
}

interface Lesson {
  id: string;
  title: string;
  subject: string;
  difficulty: number;
}

interface StudentProgress {
  user_id: string;
  lesson_id: string;
  stars: number;
  score: number;
  completed_at: string;
  users: {
    name: string;
  };
  lessons: {
    title: string;
    subject: string;
  };
}

const TeacherDashboard = () => {
  const { profile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [recentProgress, setRecentProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      // Fetch all students
      const { data: studentsData } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student');

      // Fetch lessons
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch recent progress with student and lesson details
      const { data: progressData } = await supabase
        .from('progress')
        .select(`
          *,
          users:user_id(name),
          lessons:lesson_id(title, subject)
        `)
        .order('completed_at', { ascending: false })
        .limit(10);

      // Calculate stats for each student
      if (studentsData) {
        const studentsWithStats = await Promise.all(
          studentsData.map(async (student) => {
            const { data: progressData } = await supabase
              .from('progress')
              .select('stars')
              .eq('user_id', student.id);

            const totalStars = progressData?.reduce((sum, p) => sum + p.stars, 0) || 0;
            const completedLessons = progressData?.length || 0;

            return {
              ...student,
              total_stars: totalStars,
              completed_lessons: completedLessons,
            };
          })
        );
        setStudents(studentsWithStats);
      }

      setLessons(lessonsData || []);
      setRecentProgress(progressData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = students.length;
  const totalLessons = lessons.length;
  const averageStars = students.length > 0 
    ? students.reduce((sum, s) => sum + s.total_stars, 0) / students.length 
    : 0;
  const activeStudents = students.filter(s => s.completed_lessons > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Teacher Dashboard 👨‍🏫
          </h1>
          <p className="text-muted-foreground">Welcome back, {profile?.name}! Monitor your students' progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Stars</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{Math.round(averageStars)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="progress">Recent Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Student Overview</CardTitle>
                <CardDescription>Monitor your students' performance and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <Card key={student.id} className="bg-background">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{student.name}</CardTitle>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-bold">{student.total_stars}</span>
                          </div>
                        </div>
                        <CardDescription>Language: {student.language}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completed Lessons:</span>
                            <span className="font-semibold">{student.completed_lessons}</span>
                          </div>
                          <Badge variant={student.completed_lessons > 0 ? "default" : "secondary"}>
                            {student.completed_lessons > 0 ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons">
            <Card className="bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lesson Management</CardTitle>
                    <CardDescription>View and manage your lessons</CardDescription>
                  </div>
                  <Button>Add New Lesson</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lessons.map((lesson) => (
                    <Card key={lesson.id} className="bg-background">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        <CardDescription>{lesson.subject}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            Difficulty: {lesson.difficulty}/5
                          </Badge>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Student Progress</CardTitle>
                <CardDescription>Latest activities and achievements from your students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProgress.map((progress, index) => (
                    <div key={`${progress.user_id}-${progress.lesson_id}-${index}`} 
                         className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{progress.users?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Completed: {progress.lessons?.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(progress.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-bold">{progress.stars}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Score: {progress.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;