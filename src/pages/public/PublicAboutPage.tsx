
import React from 'react';
import { PublicSiteLayout } from '@/components/public/PublicSiteLayout';
import { SiteThemeProvider } from '@/components/public/ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTenant } from '@/hooks/useTenant';
import { Users, Target, Award, Heart } from 'lucide-react';

export const PublicAboutPage: React.FC = () => {
  const { tenant } = useTenant();

  return (
    <SiteThemeProvider defaultTheme="modern">
      <PublicSiteLayout>
        <div className="py-12">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">About {tenant?.name}</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our story of educational excellence, innovation, and commitment to nurturing future leaders.
              </p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Mission & Vision */}
            <section className="py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card className="bg-card rounded-xl shadow-lg border-0">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <Target className="w-8 h-8 text-primary mr-3" />
                      <CardTitle className="text-2xl">Our Mission</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      To provide quality education that empowers students with knowledge, skills, and values necessary 
                      to become responsible global citizens and successful leaders in their chosen fields.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card rounded-xl shadow-lg border-0">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <Heart className="w-8 h-8 text-primary mr-3" />
                      <CardTitle className="text-2xl">Our Vision</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      To be a leading educational institution that nurtures innovative thinking, character development, 
                      and academic excellence while fostering a inclusive and supportive learning environment.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-muted/30 rounded-2xl">
              <div className="max-w-6xl mx-auto px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                  <p className="text-muted-foreground">The principles that guide everything we do</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: Award,
                      title: 'Excellence',
                      description: 'Striving for the highest standards in all aspects of education'
                    },
                    {
                      icon: Users,
                      title: 'Integrity',
                      description: 'Building trust through honesty, transparency, and ethical conduct'
                    },
                    {
                      icon: Heart,
                      title: 'Compassion',
                      description: 'Fostering empathy, kindness, and understanding in our community'
                    },
                    {
                      icon: Target,
                      title: 'Innovation',
                      description: 'Embracing creativity and new approaches to learning and teaching'
                    }
                  ].map((value, index) => (
                    <div key={index} className="text-center">
                      <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* History */}
            <section className="py-16">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Our History</h2>
                  <p className="text-muted-foreground">A legacy of educational excellence</p>
                </div>

                <div className="space-y-8">
                  <Card className="bg-card rounded-xl shadow-lg border-0">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-semibold mb-4">Foundation & Early Years</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {tenant?.name} was established with a vision to provide quality education that combines 
                        academic rigor with character development. From our humble beginnings, we have grown into 
                        a renowned institution known for our commitment to excellence.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card rounded-xl shadow-lg border-0">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-semibold mb-4">Growth & Development</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Over the years, we have continuously evolved our curriculum, infrastructure, and teaching 
                        methodologies to meet the changing needs of education. Our graduates have gone on to achieve 
                        success in various fields, making us proud of our educational legacy.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card rounded-xl shadow-lg border-0">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-semibold mb-4">Today & Tomorrow</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Today, we continue to uphold our founding principles while embracing innovation and technology. 
                        We are committed to preparing our students for the challenges and opportunities of the 21st century 
                        through comprehensive education and holistic development.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Statistics */}
            <section className="py-16 bg-primary text-primary-foreground rounded-2xl">
              <div className="max-w-6xl mx-auto px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
                  <p className="opacity-90">Numbers that reflect our commitment to excellence</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold mb-2">25+</div>
                    <div className="opacity-90">Years of Excellence</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">2500+</div>
                    <div className="opacity-90">Students</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">150+</div>
                    <div className="opacity-90">Faculty Members</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">98%</div>
                    <div className="opacity-90">College Acceptance</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </PublicSiteLayout>
    </SiteThemeProvider>
  );
};
