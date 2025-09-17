import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, BookOpen, Target } from 'lucide-react';

interface Achievement {
  id: string;
  studentName: string;
  avatar: string;
  achievement: string;
  stars: number;
  subject: string;
  timestamp: string;
  type: 'lesson' | 'quiz' | 'milestone';
}

const CommunityWall = () => {
  const achievements: Achievement[] = [
    {
      id: '1',
      studentName: 'Ravi Kumar',
      avatar: '👦',
      achievement: 'Completed Math Lesson: Addition & Subtraction',
      stars: 3,
      subject: 'Math',
      timestamp: '2 hours ago',
      type: 'lesson'
    },
    {
      id: '2',
      studentName: 'Priya Sharma',  
      avatar: '👧',
      achievement: 'Perfect Score in Science Quiz!',
      stars: 5,
      subject: 'Science',
      timestamp: '4 hours ago',
      type: 'quiz'
    },
    {
      id: '3',
      studentName: 'Arjun Singh',
      avatar: '👦',
      achievement: 'Reached 50 Stars Milestone!',
      stars: 10,
      subject: 'Overall',
      timestamp: '1 day ago', 
      type: 'milestone'
    },
    {
      id: '4',
      studentName: 'Meera Patel',
      avatar: '👧',
      achievement: 'First English Lesson Complete',
      stars: 2,
      subject: 'English',
      timestamp: '1 day ago',
      type: 'lesson'
    }
  ];

  const getAchievementIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="w-5 h-5" />;
      case 'quiz':
        return <Target className="w-5 h-5" />;
      case 'milestone':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getAchievementColor = (type: Achievement['type']) => {
    switch (type) {
      case 'lesson':
        return 'bg-primary/10 text-primary';
      case 'quiz':
        return 'bg-accent/10 text-accent';
      case 'milestone':
        return 'bg-gradient-celebration text-white';
      default:
        return 'bg-secondary/10 text-secondary';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">🎉 Community Wall</h2>
        <p className="text-muted-foreground">Celebrate your classmates' achievements!</p>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-xl">
                    {achievement.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getAchievementColor(achievement.type)}`}>
                  {getAchievementIcon(achievement.type)}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{achievement.studentName}</h4>
                  <Badge variant="outline" className="text-xs">
                    {achievement.subject}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-2">{achievement.achievement}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < achievement.stars
                            ? 'fill-star-gold text-star-gold'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-star-gold">
                      {achievement.stars} stars
                    </span>
                  </div>
                  
                  <span className="text-sm text-muted-foreground">
                    {achievement.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Leaderboard */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          This Week's Top Performers
        </h3>
        
        <div className="space-y-3">
          {[
            { name: 'Priya Sharma', stars: 25, rank: 1 },
            { name: 'Arjun Singh', stars: 23, rank: 2 },
            { name: 'Ravi Kumar', stars: 20, rank: 3 }
          ].map((student) => (
            <div key={student.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  student.rank === 1 ? 'bg-star-gold text-white' :
                  student.rank === 2 ? 'bg-star-silver text-white' :
                  'bg-star-bronze text-white'
                }`}>
                  {student.rank}
                </div>
                <span className="font-medium">{student.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-star-gold text-star-gold" />
                <span className="font-semibold text-star-gold">{student.stars}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CommunityWall;