"use client";
import { defineStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const { Stepper, useStepper } = defineStepper(
    {
        id: "service-type",
        label: "Connect Service",
        description: "Choose your communication platform",
    },
    {
        id: "service-source",
        label: "Select Source",
        description: "Choose where to pull users from",
    },
    {
        id: "target-destination",
        label: "Set Destination",
        description: "Choose channel or people to message",
    },
    {
        id: "schedule-interval",
        label: "Set Schedule",
        description: "Configure message frequency",
    }
);

export default function OnboardingPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome to Auto-Standup</h1>
                <p className="text-muted-foreground">Let's set up your automated standup messages in 4 simple steps.</p>
            </div>

            <Stepper.Provider>
                {({ methods }) => (
                    <>
                        {/* Progress Navigation */}
                        <Stepper.Navigation className="mb-8" />
                        
                        {/* Current Step Content */}
                        <div className="space-y-6">
                            {methods.current.id === "service-type" && (
                                <div>
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-semibold mb-2">Connect Your Service</h2>
                                        <p className="text-muted-foreground">
                                            Choose which communication platform you'd like to use for standup messages
                                        </p>
                                    </div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Select Communication Platform</CardTitle>
                                            <CardDescription>
                                                Choose the service where your team communicates
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {[
                                                    { name: "Discord", icon: "🎮" },
                                                    { name: "Slack", icon: "💬" },
                                                    { name: "Microsoft Teams", icon: "🏢" },
                                                    { name: "WhatsApp", icon: "📱" },
                                                    { name: "Telegram", icon: "✈️" }
                                                ].map((service) => (
                                                    <Button
                                                        key={service.name}
                                                        variant="outline"
                                                        className="h-20 flex-col gap-2"
                                                        onClick={() => methods.next()}
                                                    >
                                                        <span className="text-2xl">{service.icon}</span>
                                                        <span className="text-sm">{service.name}</span>
                                                    </Button>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {methods.current.id === "service-source" && (
                                <div>
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-semibold mb-2">Select Source Location</h2>
                                        <p className="text-muted-foreground">
                                            Choose where to pull users from within your selected service
                                        </p>
                                    </div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Choose User Source</CardTitle>
                                            <CardDescription>
                                                Select the organization, server, or group to pull team members from
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                                    <div className="font-medium">My Organization</div>
                                                    <div className="text-sm text-muted-foreground">Pull from your main workspace/organization</div>
                                                </div>
                                                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                                    <div className="font-medium">Specific Server/Group</div>
                                                    <div className="text-sm text-muted-foreground">Choose a specific server, channel, or group</div>
                                                </div>
                                                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                                    <div className="font-medium">Custom List</div>
                                                    <div className="text-sm text-muted-foreground">Manually select specific users</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mt-6">
                                                <Button variant="outline" onClick={() => methods.prev()}>
                                                    Back
                                                </Button>
                                                <Button onClick={() => methods.next()}>
                                                    Continue
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {methods.current.id === "target-destination" && (
                                <div>
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-semibold mb-2">Set Message Destination</h2>
                                        <p className="text-muted-foreground">
                                            Choose where standup messages should be sent
                                        </p>
                                    </div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Message Destination</CardTitle>
                                            <CardDescription>
                                                Select the channel, group chat, or specific people to receive standup messages
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Destination Type</label>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <input type="radio" id="channel" name="destination" className="h-4 w-4" />
                                                            <label htmlFor="channel" className="text-sm">Send to a channel/group chat</label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <input type="radio" id="admins" name="destination" className="h-4 w-4" />
                                                            <label htmlFor="admins" className="text-sm">Send to specific people (admins)</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Select Channel/People</label>
                                                    <div className="p-3 border rounded-md bg-muted/50">
                                                        <div className="text-sm text-muted-foreground">
                                                            Choose your destination after selecting the type above
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mt-6">
                                                <Button variant="outline" onClick={() => methods.prev()}>
                                                    Back
                                                </Button>
                                                <Button onClick={() => methods.next()}>
                                                    Continue
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {methods.current.id === "schedule-interval" && (
                                <div>
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-semibold mb-2">Configure Schedule</h2>
                                        <p className="text-muted-foreground">
                                            Set how often standup reminders should be sent
                                        </p>
                                    </div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Schedule Settings</CardTitle>
                                            <CardDescription>
                                                Choose the frequency and timing for your standup messages
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium">Frequency</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Button variant="outline" className="justify-start">
                                                            📅 Daily
                                                        </Button>
                                                        <Button variant="outline" className="justify-start">
                                                            📋 Weekly
                                                        </Button>
                                                        <Button variant="outline" className="justify-start">
                                                            🗓️ Bi-weekly
                                                        </Button>
                                                        <Button variant="outline" className="justify-start">
                                                            📆 Custom
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium">Time</label>
                                                    <div className="flex items-center space-x-4">
                                                        <input 
                                                            type="time" 
                                                            className="px-3 py-2 border rounded-md"
                                                            defaultValue="09:00"
                                                        />
                                                        <select className="px-3 py-2 border rounded-md">
                                                            <option>UTC</option>
                                                            <option>Local Time</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium">Days (for weekly/bi-weekly)</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                                            <Button key={day} variant="outline" size="sm">
                                                                {day}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mt-6">
                                                <Button variant="outline" onClick={() => methods.prev()}>
                                                    Back
                                                </Button>
                                                <Button className="bg-green-600 hover:bg-green-700">
                                                    Complete Setup
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Stepper.Provider>
        </div>
    );
}