
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { QrCode, Fingerprint, CreditCard, Smartphone, User, Scan, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AttendanceMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
  color: string;
}

export const MultiModalAttendance: React.FC = () => {
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState('');
  const [rfidCode, setRfidCode] = useState('');
  const [selectedMode, setSelectedMode] = useState('manual');

  const attendanceModes: AttendanceMode[] = [
    {
      id: 'manual',
      name: 'Manual Entry',
      icon: <User className="h-5 w-5" />,
      description: 'Teachers manually mark attendance',
      enabled: true,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'qr',
      name: 'QR Code',
      icon: <QrCode className="h-5 w-5" />,
      description: 'Students scan QR code to check-in',
      enabled: true,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'biometric',
      name: 'Biometric',
      icon: <Fingerprint className="h-5 w-5" />,
      description: 'Fingerprint or Face ID verification',
      enabled: false,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'rfid',
      name: 'RFID Card',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Card-based entry system',
      enabled: true,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Mobile check-in for staff',
      enabled: true,
      color: 'bg-pink-100 text-pink-800'
    }
  ];

  const handleQRScan = () => {
    if (!qrCode) {
      toast({
        title: "Error",
        description: "Please enter QR code",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "QR Code Scanned",
      description: `Student checked in successfully with code: ${qrCode}`,
    });
    setQrCode('');
  };

  const handleRFIDScan = () => {
    if (!rfidCode) {
      toast({
        title: "Error",
        description: "Please scan RFID card",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "RFID Card Scanned",
      description: `Access granted for card: ${rfidCode}`,
    });
    setRfidCode('');
  };

  const handleBiometricScan = () => {
    toast({
      title: "Biometric Scan",
      description: "Biometric verification initiated...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Attendance Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Modal Attendance System</CardTitle>
          <CardDescription>
            Choose and configure different attendance marking methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendanceModes.map((mode) => (
              <div
                key={mode.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMode === mode.id ? 'ring-2 ring-primary' : ''
                } ${mode.enabled ? 'hover:shadow-md' : 'opacity-50'}`}
                onClick={() => mode.enabled && setSelectedMode(mode.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {mode.icon}
                    <h3 className="font-medium">{mode.name}</h3>
                  </div>
                  <Badge className={mode.color}>
                    {mode.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{mode.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Attendance Check-in
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMode} onValueChange={setSelectedMode}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="biometric" disabled={!attendanceModes.find(m => m.id === 'biometric')?.enabled}>
                Biometric
              </TabsTrigger>
              <TabsTrigger value="rfid">RFID</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-4">
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Manual Attendance</h3>
                <p className="text-muted-foreground mb-4">
                  Use the attendance marking interface to manually record student presence
                </p>
                <Button>Go to Manual Attendance</Button>
              </div>
            </TabsContent>

            <TabsContent value="qr" className="mt-4">
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-center">
                  <QrCode className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-medium mb-2">QR Code Scanner</h3>
                  <p className="text-muted-foreground mb-4">
                    Students can scan their QR code to mark attendance
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qr-input">QR Code</Label>
                  <Input
                    id="qr-input"
                    placeholder="Scan or enter QR code"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                  />
                </div>
                <Button onClick={handleQRScan} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="biometric" className="mt-4">
              <div className="text-center py-8">
                <Fingerprint className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-lg font-medium mb-2">Biometric Scanner</h3>
                <p className="text-muted-foreground mb-4">
                  Place finger on scanner or look at camera for verification
                </p>
                <Button onClick={handleBiometricScan} variant="outline">
                  <Scan className="h-4 w-4 mr-2" />
                  Start Biometric Scan
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="rfid" className="mt-4">
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-center">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                  <h3 className="text-lg font-medium mb-2">RFID Card Reader</h3>
                  <p className="text-muted-foreground mb-4">
                    Tap your RFID card on the reader
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfid-input">Card ID</Label>
                  <Input
                    id="rfid-input"
                    placeholder="RFID card detected..."
                    value={rfidCode}
                    onChange={(e) => setRfidCode(e.target.value)}
                  />
                </div>
                <Button onClick={handleRFIDScan} className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Verify Card
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="mobile" className="mt-4">
              <div className="text-center py-8">
                <Smartphone className="h-12 w-12 mx-auto mb-4 text-pink-600" />
                <h3 className="text-lg font-medium mb-2">Mobile Check-in</h3>
                <p className="text-muted-foreground mb-4">
                  Staff can use mobile app for location-based attendance
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline">
                    Download App
                  </Button>
                  <Button>
                    Check-in Now
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'John Doe', method: 'QR Code', time: '08:15 AM', status: 'success' },
              { name: 'Jane Smith', method: 'RFID', time: '08:12 AM', status: 'success' },
              { name: 'Bob Johnson', method: 'Manual', time: '08:10 AM', status: 'late' },
            ].map((checkin, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    checkin.status === 'success' ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                  <div>
                    <p className="font-medium">{checkin.name}</p>
                    <p className="text-sm text-muted-foreground">{checkin.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{checkin.time}</p>
                  <Badge variant={checkin.status === 'success' ? 'default' : 'secondary'}>
                    {checkin.status === 'success' ? 'On Time' : 'Late'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
