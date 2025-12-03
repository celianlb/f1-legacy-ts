
/**
 * legacyRaceSystem.ts
 *
 * Ce fichier simule un mini backend F1.
 * Il "fonctionne", mais il est volontairement :
 *  - mal structuré
 *  - plein de duplication
 *  - avec des responsabilités mélangées
 *  - sans SOLID
 *  - sans design patterns
 *
 * Votre mission : l'auditer et le refactorer.
 */

// Tout est typé à la va-vite...
type Driver = {
  id: string;
  name: string;
  team: string; // ex: "Ferrari", "Mercedes", etc.
};

type Race = {
  id: string;
  name: string;
  circuit: string;
  totalLaps: number;
};

type EventType = "lapCompleted" | "pitStop" | "overtake" | "penalty" | "dnf";

type RaceEvent = {
  id: string;
  raceId: string;
  type: EventType;
  driverId: string;
  lapNumber?: number;
  targetDriverId?: string;
  penaltyReason?: string;
};

const drivers: Driver[] = [
  { id: "leclerc", name: "Charles Leclerc", team: "Ferrari" },
  { id: "sainz", name: "Carlos Sainz", team: "Ferrari" },
  { id: "hamilton", name: "Lewis Hamilton", team: "Mercedes" },
  { id: "russell", name: "George Russell", team: "Mercedes" },
];

const race: Race = {
  id: "monaco-2025",
  name: "Grand Prix de Monaco 2025",
  circuit: "Monaco",
  totalLaps: 5,
};

// Beaucoup de variables globales...
let events: RaceEvent[] = [];
let overtakesCount = 0;
let pitStopsCount = 0;
let penaltiesCount = 0;
let dnfCount = 0;

// Faux service externe (appelé en dur)
class ExternalF1HighlightApi {
  sendHighlight(payload: string) {
    console.log("[External API] Highlight sent:", payload);
  }
}

const externalApi = new ExternalF1HighlightApi();

// Fonctions utilitaires très spécifiques, dupliquées, etc.
function logInfo(message: string) {
  console.log("[INFO]", new Date().toISOString(), message);
}

function logError(message: string) {
  console.log("[ERROR]", new Date().toISOString(), message);
}

// Notifier une équipe en fonction de son nom, avec un gros switch
function notifyTeam(team: string, message: string) {
  if (team === "Ferrari") {
    console.log("🔥 [Ferrari] " + message);
  } else if (team === "Mercedes") {
    console.log("⭐ [Mercedes] " + message);
  } else {
    console.log("[Autre équipe]", team, message);
  }
}

// Enregistrement brut d'un événement
function registerEvent(event: RaceEvent) {
  events.push(event);
  logInfo("Event registered: " + JSON.stringify(event));

  if (event.type === "overtake") {
    overtakesCount++;
    const driver = drivers.find((d) => d.id === event.driverId);
    if (driver) {
      notifyTeam(driver.team, driver.name + " dépasse " + event.targetDriverId);
    }
    // On envoie aussi un "highlight" à l'API externe
    externalApi.sendHighlight(
      JSON.stringify({
        type: event.type,
        raceId: event.raceId,
        driverId: event.driverId,
        lap: event.lapNumber,
      })
    );
  } else if (event.type === "pitStop") {
    pitStopsCount++;
    const driver = drivers.find((d) => d.id === event.driverId);
    if (driver) {
      notifyTeam(driver.team, driver.name + " rentre au stand au tour " + event.lapNumber);
    }
  } else if (event.type === "penalty") {
    penaltiesCount++;
    const driver = drivers.find((d) => d.id === event.driverId);
    if (driver) {
      notifyTeam(
        driver.team,
        driver.name + " reçoit une pénalité: " + (event.penaltyReason || "raison inconnue")
      );
    }
    // Encore un highlight très similaire...
    externalApi.sendHighlight(
      JSON.stringify({
        type: event.type,
        raceId: event.raceId,
        driverId: event.driverId,
        reason: event.penaltyReason,
      })
    );
  } else if (event.type === "dnf") {
    dnfCount++;
    const driver = drivers.find((d) => d.id === event.driverId);
    if (driver) {
      notifyTeam(driver.team, driver.name + " abandonne la course !");
    }
    externalApi.sendHighlight(
      JSON.stringify({
        type: event.type,
        raceId: event.raceId,
        driverId: event.driverId,
      })
    );
  } else if (event.type === "lapCompleted") {
    // On log juste un truc basique
    const driver = drivers.find((d) => d.id === event.driverId);
    if (driver) {
      logInfo(driver.name + " termine le tour " + event.lapNumber);
    }
  }
}

// Simulation complètement écrite en dur
function simulateRace() {
  logInfo("Début de la course " + race.name);

  for (let lap = 1; lap <= race.totalLaps; lap++) {
    logInfo("=== Tour " + lap + " ===");

    // Tous les pilotes complètent le tour
    for (const driver of drivers) {
      registerEvent({
        id: "lap-" + lap + "-" + driver.id,
        raceId: race.id,
        type: "lapCompleted",
        driverId: driver.id,
        lapNumber: lap,
      });
    }

    if (lap === 2) {
      // Dépassement
      registerEvent({
        id: "ov-1",
        raceId: race.id,
        type: "overtake",
        driverId: "leclerc",
        targetDriverId: "hamilton",
        lapNumber: lap,
      });
    }

    if (lap === 3) {
      // Pit stop
      registerEvent({
        id: "pit-1",
        raceId: race.id,
        type: "pitStop",
        driverId: "sainz",
        lapNumber: lap,
      });
    }

    if (lap === 4) {
      // Pénalité
      registerEvent({
        id: "pen-1",
        raceId: race.id,
        type: "penalty",
        driverId: "hamilton",
        penaltyReason: "Track limits",
        lapNumber: lap,
      });
    }

    if (lap === 5) {
      // Abandon
      registerEvent({
        id: "dnf-1",
        raceId: race.id,
        type: "dnf",
        driverId: "russell",
        lapNumber: lap,
      });
    }
  }

  logInfo("Fin de la course " + race.name);
  printStats();
}

// Fonction qui mélange stats, présentation, etc.
function printStats() {
  console.log("=== STATS COURSE ===");
  console.log("Nombre de tours simulés:", race.totalLaps);
  console.log("Nombre total d'événements:", events.length);
  console.log("Dépassements:", overtakesCount);
  console.log("Passages aux stands:", pitStopsCount);
  console.log("Pénalités:", penaltiesCount);
  console.log("Abandons:", dnfCount);

  // On affiche aussi la liste brute des événements
  console.log("=== EVENTS RAW ===");
  for (const e of events) {
    console.log(e.id, e.type, e.driverId, e.lapNumber || "-");
  }
}

simulateRace();
