// Variables globales
let currentStep = 1;
const totalSteps = 5;
let userType = '';

const stepTitles = {
    1: 'Votre Profil',
    2: 'Localisation à Dakar',
    3: 'Informations Véhicules',
    4: 'Budget & Intérêt',
    5: 'Vos Coordonnées'
};

// Navigation entre pages
function showFormPage() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('formPage').style.display = 'block';
    currentStep = 1;
    userType = '';
    showStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLandingPage() {
    document.getElementById('formPage').style.display = 'none';
    document.getElementById('landingPage').style.display = 'block';
    resetForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Affichage des étapes - VERSION CORRIGÉE
function showStep(step) {
    // Masquer TOUTES les étapes
    const allSteps = document.querySelectorAll('.form-step');
    allSteps.forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });
    
    // Afficher l'étape demandée
    let stepToShow = null;
    
    if (step === 3) {
        if (userType === 'individual') {
            stepToShow = document.querySelector('.b2c-step[data-step="3"]');
        } else if (userType === 'professional') {
            stepToShow = document.querySelector('.b2b-step[data-step="3"]');
        }
    } else {
        stepToShow = document.querySelector(`.form-step[data-step="${step}"]:not(.b2c-step):not(.b2b-step)`);
    }
    
    if (stepToShow) {
        stepToShow.style.display = 'block';
        stepToShow.classList.add('active');
    }
    
    // Mise à jour UI
    updateProgressSteps(step);
    const progress = (step / totalSteps) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('formTitle').textContent = stepTitles[step];
    
    // Boutons
    document.getElementById('prevBtn').style.display = step > 1 ? 'inline-flex' : 'none';
    document.getElementById('nextBtn').style.display = step < totalSteps ? 'inline-flex' : 'none';
    document.getElementById('submitBtn').style.display = step === totalSteps ? 'inline-flex' : 'none';
}

function updateProgressSteps(currentStep) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
    });
}

// Validation
function validateCurrentStep() {
    const currentStepEl = document.querySelector('.form-step.active');
    
    // Étape 1: Sélection obligatoire du profil
    if (currentStep === 1) {
        const userTypeSelected = document.querySelector('input[name="userType"]:checked');
        if (!userTypeSelected) {
            alert('⚠️ Veuillez d\'abord sélectionner votre profil (Particulier ou Professionnel)');
            return false;
        }
        return true;
    }
    
    // Étape 2: Validation quartier "Autre"
    if (currentStep === 2) {
        const quarterSelect = document.getElementById('quarter');
        const otherQuarterInput = document.getElementById('otherQuarter');
        
        if (quarterSelect.value === 'autre' && !otherQuarterInput.value.trim()) {
            alert('⚠️ Veuillez préciser votre quartier');
            otherQuarterInput.focus();
            return false;
        }
    }
    
    // Étape 4: Niveau d'intérêt obligatoire
    if (currentStep === 4) {
        const interestSelected = document.querySelector('input[name="interest"]:checked');
        if (!interestSelected) {
            alert('⚠️ Veuillez indiquer votre niveau d\'intérêt');
            return false;
        }
    }
    
    // Validation des champs requis
    if (currentStepEl) {
        const requiredFields = currentStepEl.querySelectorAll('input[required], select[required]');
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                alert('⚠️ Veuillez remplir tous les champs obligatoires');
                field.focus();
                return false;
            }
        }
    }
    
    // Étape 5: Validation email et téléphone
    if (currentStep === 5) {
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            alert('⚠️ Email invalide');
            emailField.focus();
            return false;
        }
        
        const phoneField = document.getElementById('phone');
        const phoneRegex = /^(\+221)?[\s]?[0-9]{2}[\s]?[0-9]{3}[\s]?[0-9]{2}[\s]?[0-9]{2}$/;
        if (!phoneRegex.test(phoneField.value.trim())) {
            alert('⚠️ Format téléphone invalide (ex: 77 123 45 67)');
            phoneField.focus();
            return false;
        }
    }
    
    return true;
}

function updateFormForUserType() {
    const b2cSteps = document.querySelectorAll('.b2c-step');
    const b2bSteps = document.querySelectorAll('.b2b-step');
    
    if (userType === 'individual') {
        b2cSteps.forEach(step => step.style.display = 'block');
        b2bSteps.forEach(step => step.style.display = 'none');
        stepTitles[3] = 'Vos Véhicules';
    } else if (userType === 'professional') {
        b2cSteps.forEach(step => step.style.display = 'none');
        b2bSteps.forEach(step => step.style.display = 'block');
        stepTitles[3] = 'Votre Entreprise';
    }
}

function resetForm() {
    document.getElementById('gaarelForm').reset();
    currentStep = 1;
    userType = '';
    showStep(1);
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('confirmationPage').classList.remove('show');
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation...');
    
    // Navigation
    document.getElementById('nextBtn').addEventListener('click', function() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
      }
    });

    document.getElementById('prevBtn').addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });
    
    // Type d'utilisateur
    document.querySelectorAll('input[name="userType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            userType = this.value;
            updateFormForUserType();
        });
    });
    
    // Soumission
    document.getElementById('gaarelForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Vérifier QUE L'ÉTAPE 1 a été remplie
    const userTypeSelected = document.querySelector('input[name="userType"]:checked');
    if (!userTypeSelected) {
        alert('❌ ERREUR : Vous devez d\'abord sélectionner votre profil à l\'étape 1 (Particulier ou Professionnel).\n\nRetournez à l\'étape 1 pour compléter votre profil.');
        // Retourner à l'étape 1
        currentStep = 1;
        showStep(1);
        return;
    }
    
    // Valider l'étape actuelle
    if (!validateCurrentStep()) {
        return;
    }
    
    // Si tout est OK, soumettre
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    console.log('📊 Données collectées:', data);
    console.log('📧 Email à: hellogaarel@gmail.com');
    
    // Simulation envoi
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('confirmationPage').classList.add('show');
});
    
    showStep(1);
    console.log('Prêt!');
});