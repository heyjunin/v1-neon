import { EmailServiceStatus } from "@/components/email-service-status";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Email Service</h1>
          <p className="text-muted-foreground">
            Sistema de envio de emails para a aplicação v1
          </p>
        </div>

        <EmailServiceStatus />

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Funcionalidades</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Envio de emails de boas-vindas</li>
            <li>• Integração com Supabase Auth</li>
            <li>• Templates de email responsivos</li>
            <li>• Webhook para autenticação</li>
            <li>• Logs detalhados de envio</li>
          </ul>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Endpoints</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono">
                POST
              </span>
              <code className="text-muted-foreground">
                /api/webhook/send-email
              </code>
            </div>
            <p className="text-muted-foreground">
              Webhook para receber notificações do Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
